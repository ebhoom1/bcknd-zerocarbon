const express = require("express");
const router = express.Router();
const getMonthlyTotalEmissions  = require("../../controllers/userdashboard/getMonthlyco2eEmission");
const getMonthlyEnergyWater = require("../../controllers/userdashboard/getMonthlyEnergyWater");

router.get("/monthly-energy-water/:userId", getMonthlyEnergyWater);
router.get("/monthly-emissions/:userId", getMonthlyTotalEmissions.getMonthlyTotalEmissions);

module.exports = router;
