const express = require("express");
const router = express.Router();
const downloadReport = require("../controllers/report/downloadReport");
const {saveSectionB}=require("../controllers/report/sectionBsubmissionController");

router.post("/reports/generate/:userId", downloadReport.downloadReport);
router.post("/sectionb",saveSectionB)

module.exports = router;
