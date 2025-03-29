const express = require("express");
const router = express.Router();
const downloadSectionAReport = require("../controllers/report/downloadSectionAReport");

router.post("/reports/generate/:userId", downloadSectionAReport.downloadSectionAReport);

module.exports = router;
