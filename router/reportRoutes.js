const express = require("express");
const router = express.Router();
const downloadReport = require("../controllers/report/downloadReport");
const {saveSectionB}=require("../controllers/report/sectionBsubmissionController");
const {saveSectionC}=require("../controllers/report/sectionCsubmissionController");

router.post("/reports/generate/:userId", downloadReport.downloadReport);
router.post("/sectionb",saveSectionB)
router.post("/sectionc",saveSectionC)

module.exports = router;
