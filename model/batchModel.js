const db = require("../util/db");

module.exports = class batchFileModel {
  static uniqueId() {
    const dateString = Date.now().toString(36);
    const randomness = Math.random().toString(36).substr(2);
    return dateString + randomness;
  }

  static addNewBatch(newData) {
    const uniqID = this.uniqueId();
    return db
      .execute(
        "INSERT INTO batch_formula(batchNum, production_line, finmat_prod, rawmat_list, rawmat_quans, rawmat_specs, timeneeded, efficency, shift, prod_quan, waste_name, waste_quan, waste_unit, rawmat_unit, prod_unit, finmat_spec) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          uniqID,
          newData.production_line,
          newData.finmat_prod,
          newData.rawmat_list,
          newData.rawmat_quans || "",
          newData.rawmat_specs || "",
          newData.timeneeded,
          newData.efficency,
          newData.shift,
          newData.prod_quan,
          newData.waste_name,
          newData.waste_quan,
          newData.waste_unit,
          newData.rawmat_unit || "",
          newData.prod_unit,
          newData.finmat_spec,
        ]
      )
      .then((result) => {
        return [true, "New batch formula is added"];
      })
      .catch((err) => {
        return [false, err];
      });
  }

  static showAllBatch() {
    return db
      .execute("SELECT * FROM batch_formula")
      .then((response) => {
        return response[0];
      })
      .catch((err) => {
        return err;
      });
  }
  static selectBatchFile(finName, finSpec) {
    return db
      .execute(
        "SELECT * FROM batch_formula WHERE finmat_prod = '" +
          finName +
          "' AND finmat_spec = '" +
          finSpec +
          "'"
      )
      .then((respo) => {
        return [true, respo[0]];
      })
      .catch((err) => {
        return [false, err];
      });
  }
};
