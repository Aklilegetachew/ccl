const { response } = require("express");
const productionModel = require("../model/productionModel");

exports.addNewproductionOrder = (req, res, next) => {
  productionModel.addproductionOrder(req.body).then((result) => {
    if (result[0]) {
      res.status(200).json(result[1]);
    } else {
      res.status(400).json(result[1]);
    }
  });
};

exports.showProductionGM = (req, res, next) => {
  productionModel.showallProductionGM().then((result) => {
    if (result[0]) {
      res.status(200).json(result[1]);
    } else {
      res.status(400).json(result[1]);
    }
  });
};

exports.showProductionGMID = (req, res, next) => {
  productionModel.showallProductionGMID(req.body.id).then((result) => {
    if (result[0]) {
      res.status(200).json(result[1]);
    } else {
      res.status(400).json(result[1]);
    }
  });
};

exports.addProductiionGM = (req, res, next) => {
  productionModel.addproductionOrderGM(req.body).then((result) => {
    if (result[0]) {
      res.status(200).json(result[1]);
    } else {
      res.status(400).json(result[1]);
    }
  });
};

exports.showFinishedProduction = (req, res, next) => {
  productionModel.showFinished().then((respo) => {
    if (respo[0]) {
      res.status(200).json(respo[1]);
    } else {
      res.status(406).json({ err: respo[1] });
    }
  });
};

exports.summeryMaker = (req, res, next) => {
  productionModel.addSummery(req.body).then((result) => {
    res.status(200).json({ message: result });
  });
};

exports.productFinshed = (req, res, next) => {
  // make sure to add som values by defualt in the front end

  productionModel.completeOrder(req.body).then(async (result) => {
    if (result[0] == false) {
      res.status(403).json({ message: "error requesting" });
    } else {
      const respo = await productionModel.sendtoWareHouse(req.body);
      console.log(respo);
      console.log(result);
      const resu = await productionModel.makeFinished(req.body);
      res.status(200).json({ message: resu[1] });
    }
  });
};

exports.startProduction = async (req, res, next) => {
  const productionStatus = req.body.status;
  const productionId = req.body.id;
  const personId = req.body.userName;
  // console.log(productionStatus);
  if (productionStatus == "START") {
    // select the order

    const selectedResult = await productionModel.selectOrder(productionId);

    // select and send the raw material to warehouse
    if (selectedResult[0]) {
      const resultRawmaterial = await productionModel.makeRawMatRequest(
        selectedResult[1],
        productionId,
        personId
      );

      console.log(resultRawmaterial);
      if (resultRawmaterial) {
        const respoStatus = await productionModel.statusStarted(productionId);

        if (respoStatus[0]) {
          res.status(200).json({ message: "Started !" });
        } else {
          res.status(428).json({ message: "update status error" });
        }
      } else {
        res.status(428).json({ message: "error making raw material request" });
      }
    } else {
      res.status(428).json({ message: "cant found the order to start" });
    }

    // finish the production order
  } else if (productionStatus == "END") {
    productionModel.statusEnd(productionId).then((result) => {
      if (result[0]) {
        res.status(200).json(result[1]);
      } else {
        res.status(200).json(result[1]);
      }
    });
  }

  // make report and summery and status Finished
};

exports.showproductionOrder = async (req, res, next) => {
  const fromReg = [];
  const fromCus = [];

  const regArray = await productionModel.showProductionOrderReg();
  const cusArray = await productionModel.showProductionOrderCustom();

  const allRes = regArray.concat(cusArray);
  console.log("all", allRes);
  res.status(200).json(allRes);
};
