const batchModule = require("../model/batchModel");

exports.addBatch = (req, res, next) => {
  batchModule.addNewBatch(req.body).then((result) => {
    if (result[0]) {
      res.status(200).json(result[1]);
    } else {
      res.status(400).json(result[1]);
    }
  });
};

exports.showBatch = (req, res, next) => {
  batchModule.showAllBatch().then((result) => {
    res.status(200).json(result[1]);
  });
};

exports.selectBatch = (req, res, next) => {
  batchModule.selectBatchFile(req.body.name, req.body.spec).then((result) => {
    if (result[0]) {
      res.status(200).json(result[1]);
    } else {
      res.status(400).json(result[1]);
    }
  });
};
