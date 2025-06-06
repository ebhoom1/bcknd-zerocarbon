const express = require("express");
const router = express.Router();
const griController = require("../../controllers/GRIcontroller/GriReportController");
const { exportGRIReport } = require("../../controllers/GRIcontroller/griExportController");

router.post("/griform/save", griController.saveGRIResponses);
router.get("/:userId", griController.getGRIResponses);
router.get("/griform/export/:userId", exportGRIReport);


module.exports = router;


