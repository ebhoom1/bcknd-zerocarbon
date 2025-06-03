const express = require("express");
const router = express.Router();
const griController = require("../../controllers/GRIcontroller/GriReportController");

router.post("/griform/save", griController.saveGRIResponses);
router.get("/:userId", griController.getGRIResponses);

module.exports = router;
