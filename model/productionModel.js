const db = require("../util/db");
const axios = require("axios");

module.exports = class productionModel {
  composerArray = new Array();
  static uniqueId() {
    const dateString = Date.now().toString(36);
    const randomness = Math.random().toString(36).substr(2);
    return dateString + randomness;
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
    return db
      .execute(
        "INSERT INTO produced(productionID, finished_name, finished_spec, finished_qty, personID, finished_description, finished_materialunit, finished_remark, finished_materialcode) VALUES (?, ?, ?, ?, ?) ",
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
        ]
      )
      .then((result) => {
        const toArray = [];
        toArray.push(data);
        return axios
          .post("http://localhost:59000/addnewPurchased", {
            toArray,
          })
          .then((respo) => {
            return respo;
          });
      })
      .catch((err) => {
        return err;
      });
  }

  static statusEnd(id) {
    return db
      .execute("SELECT * FROM production_order WHERE id ='" + id + "'")
      .then((result) => {
        if (result[0][0].status === "PENDING") {
          db.execute(
            "UPDATE production_order SET status = COMPLETED WHERE id = '" +
              id +
              "'"
          ).then((results) => {
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
        "UPDATE production_order SET status = PENDING WHERE id = '" + id + "'"
      )
      .then((result) => {
        return true;
      })
      .catch((err) => {
        return [false, err];
      });
  }

  static makeRawMatRequest(selectedOrder) {
    if (selectedOrder.custom_batch_id === "") {
      return db
        .execute(
          "SELECT * FROM batch_formula WHERE id = '" +
            selectedOrder.batch_id +
            "'"
        )
        .then((result) => {
          const rawmaterials = JSON.parse(result[0][0].rawmat_list);
          rawmaterials.forEach(async (element) => {
            await axios
              .post("http://localhost:59000/StoreRequestion", {
                mat_requestname: element.mat_requestname,
                mat_requestdept: "PRODUCTION",
                mat_reqpersonid: "IUID",
                mat_description: element.mat_description,
                mat_quantity: element.mat_quantity,
                req_materialtype: "Raw",
              })
              .then((result) => {
                return;
              });
          });
          return true;
        })
        .catch((err) => {
          return false;
        });
    }
  }

  static selectOrder(productionId) {
    const selectedOrder = {};
    db.execute(
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

    if (newData.custom_regular == "Regular") {
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
    } else if (newData.custom_regular == "Custom") {
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
        "SELECT production_order.*, batch_formula.rawmat_list, batch_formula.id FROM production_order, batch_formula WHERE batch_formula.id =production_order.batch_id"
      )
      .then((respo) => {
        return respo[0];
      })
      .catch((err) => {
        return err;
      });
  }

  static showProductionOrderCustom() {
    return db
      .execute(
        "SELECT production_order.*, custome_batch.raw_mat_needed, custome_batch.id FROM production_order, custome_batch WHERE production_order.custom_batch_id = custome_batch.custom_batch_id"
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
