const express = require("express");
const router = express.Router();
const getMonthlyTotalEmissions  = require("../../controllers/userdashboard/getMonthlyco2eEmission");
const getMonthlyEnergyWater = require("../../controllers/userdashboard/getMonthlyEnergyWater");
const getMonthlyWasteGenerated = require("../../controllers/userdashboard/getMonthlyWasteGenerated");
const getEmployeeStats = require("../../controllers/userdashboard/getEmployeeStats");

router.get("/monthly-energy-water/:userId", getMonthlyEnergyWater);
router.get("/employees-stats/:userId", getEmployeeStats);
router.get("/monthly-waste/:userId", getMonthlyWasteGenerated);
router.get("/monthly-emissions/:userId", getMonthlyTotalEmissions.getMonthlyTotalEmissions);

module.exports = router;
