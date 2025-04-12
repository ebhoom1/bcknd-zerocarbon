const express = require("express");
const router = express.Router();
const getCarbonFromFlow = require("../../controllers/emsData/additionalDataWater");

router.get("/additionaldata-water", getCarbonFromFlow); // ✅ NOT under /submissions

module.exports = router;