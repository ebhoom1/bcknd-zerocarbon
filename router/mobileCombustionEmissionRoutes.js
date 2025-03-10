const express = require("express");
const router = express.Router();
const { getMobileCombustionEmissionData } = require("../controllers/mobileCombustionEmissionController.js");

router.get("/getMobileCombustionEmissions/:userId", getMobileCombustionEmissionData);

module.exports = router;
