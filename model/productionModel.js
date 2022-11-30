const db = require("../util/db");
const axios = require("axios");
const wareAxios = require("../midelware/warehouseaxios")

module.exports = class productionModel {
  composerArray = new Array();
  static uniqueId() {
    const dateString = Date.now().toString(36);
    const randomness = Math.random().toString(36).substr(2);
    return dateString + randomness;
  }

  static makeFinished(data){
    return db.execute("UPDATE production_order SET status = 'FINISHED' WHERE id ='"+data.prodID+"'").then((respo)=>{
      return [true, "FINISHED"]
    }).catch((err)=>{
      return [false, err]
    })
  }

  static showFinished() {
    return db
      .execute("SELECT * FROM produced")
      .then((res) => {
        return [true, res[0]];
      })
      .catch((err) => {
        return [false, err];
      });
  }

  static addSummery(data) {
    return db
      .execute("INSERT INTO summery(ProductionID, finishedID) VALUES (?,?)", [
        data.productionID,
        data.finishedID,
      ])
      .then((result) => {
        return true;
      })
      .catch((err) => {
        return err;
      });
  }

  static completeOrder(data) {
    console.log(data);
    return db
      .execute(
        "INSERT INTO produced(productionID, finished_name, finished_spec, finished_qty, personID, finished_description, finished_materialunit, finished_remark, finished_materialcode, mat_color) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          data.prodID,
          data.new_name,
          data.new_spec,
          data.new_quantity,
          data.personID,
          data.new_description,
          data.new_materialunit,
          data.new_remark,
          data.new_materialcode,
          data.new_color,
        ]
      )
      .then((result) => {
        return [true, "saved Produced"];
      })
      .catch((err) => {
        console.log(err);
        return [false, err];
      });
  }

  static async sendtoWareHouse(data) {
    var toArray = [];
    toArray.push(data);
    return await  wareAxios
      .post("/addnewPurchased", toArray)
      .then((respo) => {
        return respo;
      });
  }
  static async statusEnd(id) {
    return await db
      .execute("SELECT * FROM production_order WHERE id ='" + id + "'")
      .then((result) => {
        if (result[0][0].status === "STARTED") {
          return db
            .execute(
              "UPDATE production_order SET status = 'COMPLETED' WHERE id = '" +
                id +
                "'"
            )
            .then((results) => {
              return [true, "Sucessful"];
            });
        } else {
          return [false, "needs to start first"];
        }
      });
  }

  static statusStarted(id) {
    return db
      .execute(
        "UPDATE production_order SET status = 'STARTED' WHERE id = '" + id + "'"
      )
      .then((result) => {
        return [true, result];
      })
      .catch((err) => {
        return [false, err];
      });
  }

  static makeRawMatRequest(selectedOrder, prodId, mat_reqperson) {
    // console.log(  selectedOrder[0].custom_batch_id);
    if (selectedOrder[0].custom_batch_id !== "0") {
      return db
        .execute(
          "SELECT * FROM custome_batch WHERE custom_batch_id = '" +
            selectedOrder[0].custom_batch_id +
            "'"
        )
        .then((result) => {
          // console.log(result[0]);
          const rawmaterials = JSON.parse(result[0][0].raw_mat_needed);

          rawmaterials.forEach(async (element) => {
            const newelement = {
              ...element,
              mat_requestdept: "PRODUCTION",
              mat_reqpersonid: mat_reqperson,
              req_materialtype: "RAW",
              ProductionId: prodId,
            };
            await wareAxios
              .post("/StoreRequestion", {
                material: newelement,
              })
              .then((result) => {
                return;
              })
              .catch((err) => {
                // console.log(err);
              });
          });
          return true;
        })
        .catch((err) => {
          console.log(err);
          return false;
        });
    } else {
      console.log("else");
    }
  }

  static selectOrder(productionId) {
    return db
      .execute(
        "SELECT * FROM production_order WHERE id ='" + productionId + "'"
      )
      .then((result) => {
        return [true, result[0]];
      })
      .catch((err) => {
        return [false, err];
      });
  }
  static async addproductionOrder(newData) {
    var estimated_product_quantity = 897;
    var estimated_waste_quantity = 43;
    var unique_batch_id = this.uniqueId();

    if (newData.custom_regular === "regular") {
      // var diff =
      //   (newData.end_dateTime.getTime() - newData.start_dateTime.getTime()) /
      //   1000;
      var diff = 90;
      diff /= 60;
      var timeGiven = Math.abs(diff);
      await db
        .execute(
          "SELECT * FROM batch_formula WHERE id = '" + newData.batch_id + "'"
        )
        .then((result) => {
          estimated_product_quantity =
            parseInt(result[0][0].prod_quan) *
            (newData.batch_mult *
              newData.production_line *
              newData.shift *
              ((timeGiven - newData.downTime) /
                parseInt(result[0][0].timeneeded)) *
              (newData.effieceny / parseInt(result[0][0].efficency)));
          estimated_waste_quantity =
            result[0][0].waste_quan *
            (newData.batch_mult *
              newData.production_line *
              newData.shift *
              ((timeGiven - newData.downTime) / result[0][0].timeneeded) *
              (newData.effieceny / result[0][0].efficency));
        });

      return db
        .execute(
          "INSERT INTO production_order(fin_product, fin_spec, fin_quan, batch_id, start_dateTime, end_dateTime, batch_mult, status, est_finQuan, est_westQuan) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
          [
            newData.fin_product,
            newData.fin_spec,
            newData.fin_quan,
            newData.batch_id,
            newData.start_dateTime,
            newData.end_dateTime,
            newData.batch_mult,
            newData.status,
            estimated_product_quantity,
            estimated_waste_quantity,
          ]
        )
        .then((resp) => {
          return [true, "Production order added"];
        })
        .catch((err) => {
          return [false, err];
        });
    } else if (newData.custom_regular === "custom") {
      db.execute(
        "INSERT INTO custome_batch(raw_mat_needed, expected_fin_qty, expected_waste_quan, custom_batch_id) VALUES (?, ?, ?, ?)",
        [
          newData.raw_needed,
          newData.expected_fin_qty,
          newData.expected_waste_quan,
          unique_batch_id,
        ]
      ).then((resu) => {
        console.log("Making custom Batch");
      });
      return db
        .execute(
          "INSERT INTO production_order(fin_product, fin_spec, fin_quan, batch_id, start_dateTime, end_dateTime, batch_mult, status, custom_batch_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
          [
            newData.fin_product,
            newData.fin_spec,
            newData.fin_quan,
            "",
            newData.start_dateTime,
            newData.end_dateTime,
            newData.batch_mult,
            newData.status,
            unique_batch_id,
          ]
        )
        .then((resp) => {
          return [true, "Production order added"];
        })
        .catch((err) => {
          return [false, err];
        });
    }
  }

  static addproductionOrderGM(newData) {
    return db
      .execute(
        "INSERT INTO productionordergm(final_product, final_spec, final_desc, final_quant, final_measureunit, order_reciver, final_color, final_status, produced_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          newData.final_product,
          newData.final_spec,
          newData.final_desc,
          newData.final_quant,
          newData.final_measureunit,
          newData.order_reciver,
          newData.final_color,
          "PENDING",
          newData.produced_id || 0,
        ]
      )
      .then((resp) => {
        return [true, "Production order added"];
      })
      .catch((err) => {
        return [false, err];
      });
  }

  static fromRegularBatch(elemnts) {
    return db
      .execute(
        "SELECT * FROM batch_formula WHERE id = '" + elemnts.batch_id + "'"
      )
      .then((res) => {
        elemnts.rawmat_list = res[0][0].rawmat_list;
        return elemnts;
      });
  }

  static fromCustomBatch(elemnts) {
    return db
      .execute(
        "SELECT * FROM custome_batch WHERE id = '" +
          elemnts.custom_batch_id +
          "'"
      )
      .then((res) => {
        elemnts.raw_mat_needed = res[0].raw_mat_needed;
        elemnts.expected_fin_qty = res[0].expected_fin_qty;
        elemnts.expected_waste_quan = res[0].expected_waste_quan;
        elemnts.custom_batch_id = res[0].custom_batch_id;
        return elemnts;
      });
  }

  static allProduction() {
    return db
      .execute("SELECT * FROM production_order")
      .then((respo) => {
        return respo[0];
      })
      .catch((err) => {
        console.log(err);
      });
  }

  //  static async showProductionOrder(startDate) {

  //   db.execute("")
  // SELECT batch_formula.*, production_order.*, custome_batch.* FROM batch_formula ,production_order, custome_batch WHERE  batch_formula.id =production_order.batch_id || production_order.batch_id = custome_batch.id
  //  const productionCollection = await this.allProduction();
  // const elementsarr = [];
  //    productionCollection.forEach(async (elemnts) => {
  //      if (elemnts.custom_batch_id == 0) {
  //  db.execute("SELECT production_order.*, batch_formula.rawmat_list, batch_formula.id FROM production_order, batch_formula WHERE batch_formula.id =production_order.batch_id").then((res)=>{
  //   return res[0];
  //  })
  //     const resultArr = await this.fromRegularBatch(elemnts);
  //     console.log(resultArr);
  //     elementsarr.push(resultArr);
  //  } else {
  //     const resultArr2 = await this.fromCustomBatch(elemnts);
  //     elementsarr.push(resultArr2);
  //  }
  // });
  // console.log(elementsarr);
  // return [true, elementsarr];
  //  }
  static showProductionOrderReg() {
    return db
      .execute(
        "SELECT production_order.*, batch_formula.rawmat_list, batch_formula.id AS BID FROM production_order, batch_formula WHERE batch_formula.id =production_order.batch_id"
      )
      .then((respo) => {
        return respo[0];
      })
      .catch((err) => {
        return err;
      });
  }

  static showallProductionGM() {
    return db
      .execute("SELECT * FROM productionordergm")
      .then((respo) => {
        return [true, respo[0]];
      })
      .catch((err) => {
        return [false, err];
      });
  }

  static showallProductionGMID(id) {
    return db
      .execute("SELECT * FROM productionordergm WHERE id= '" + id + "'")
      .then((respo) => {
        return [true, respo[0]];
      })
      .catch((err) => {
        return [false, err];
      });
  }
  static showProductionOrderCustom() {
    return db
      .execute(
        "SELECT production_order.*, custome_batch.raw_mat_needed, custome_batch.id AS CID FROM production_order, custome_batch WHERE production_order.custom_batch_id = custome_batch.custom_batch_id"
      )
      .then((respo) => {
        return respo[0];
      })
      .catch((err) => {
        return err;
      });
  }

  // }
};
