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

exports.summeryMaker = (req, res, next) => {
  productionModel.addSummery(req.body).then((result) => {
    res.status(200).json({ message: result });
  });
};

exports.productFinshed = (req, res, next) => {
  // make sure to add som values by defualt in the front end

  productionModel.completeOrder(req.body).then((result) => {
    if (result == false) {
      res.status(403).json({ message: "error requesting" });
    } else {
      res.status(200).json({ message: result });
    }
  });
};

exports.startProduction = (req, res, next) => {
  const productionStatus = req.status;
  const productionId = req.id;
  if (productionStatus == "START") {
    // select the order

    const selectedResult = productionModel.selectOrder(productionId);

    // select and send the raw material to warehouse
    if (selectedResult[0]) {
      const resultRawmaterial = productionModel.makeRawMatRequest(
        selectedResult[1]
      );
      if (resultRawmaterial) {
        const respoStatus = productionModel.statusStarted(productionId);

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
  // productionModel.allProduction().then(async (result) => {
  //   // result.forEach(async (elemnts) => {
  //   // if (result[0) {
  //   //   // console.log(result[1]);
  //   //   res.status(200).json(result[1]);
  //   // } else {
  //   //   res.status(40).json(result[1]);

  // });
  const regArray = await productionModel.showProductionOrderReg();
  const cusArray = await productionModel.showProductionOrderCustom();

  //  console.log("regular", regArray)
  //  console.log("cus", cusArray)

  const allRes = regArray.concat(cusArray);
  console.log("all", allRes);
};
