const batchCont = require("../controllers/batchController");
const production = require("../controllers/production");
const express = require("express");

const router = express.Router();

router.post("/addbatchformula", batchCont.addBatch);
router.get("/showbatchformula", batchCont.showBatch);
router.post("/selectbatch", batchCont.selectBatch);

/// production orders

router.post("/addProductionOrder", production.addNewproductionOrder);
router.post("/showProductionOrder", production.showproductionOrder);
router.post("/startProduction", production.startProduction);

router.post("/addProductProduced", production.productFinshed);
router.post("/makeSummery", production.summeryMaker);
module.exports = router;
