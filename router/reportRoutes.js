const express = require("express");
const router = express.Router();
const { generateReport } = require("../controllers/reportController");

router.post("/reports/generate", generateReport);

module.exports = router;
