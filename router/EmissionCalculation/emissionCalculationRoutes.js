const express = require("express");
const router = express.Router();
const { getMobileCombustionEmissionData } = require("../../controllers/EmissionCalculationController/mobileCombustionEmission");
const { calculateStationaryCombustionEmission } = require("../../controllers/EmissionCalculationController/stationaryCobustionEmission");
const { calculateIndustrialProcessesEmission } = require("../../controllers/EmissionCalculationController/industrialProcessesEmission");
const { calculateFugitiveEmissions } = require("../../controllers/EmissionCalculationController/fugitiveEmissionController");
const { calculateTotalEmissions } = require("../../controllers/EmissionCalculationController/totalEmissionController");
const { getPurchasedElectricityEmission } = require("../../controllers/EmissionCalculationController/scope2/purchasedElectricityEmission");
const { getPurchasedSteamHeatCoolingEmission } = require("../../controllers/EmissionCalculationController/scope2/PurchasedSteamHeatCooling");
const { getTotalScope2Emission } = require("../../controllers/EmissionCalculationController/scope2/totalEmission");
const { getPurchasedGoodsServicesEmission } = require("../../controllers/EmissionCalculationController/scope3/getPurchasedGoodsServicesEmission");
const { getUseSoldProductEmission } = require("../../controllers/EmissionCalculationController/scope3/getUseSoldProductEmission");
const { getEndOfLifeTreatmentEmission } = require("../../controllers/EmissionCalculationController/scope3/getEndofLifeTreatment");
const { calculateTotalScope3Emissions } = require("../../controllers/EmissionCalculationController/scope3/totalEmissionScope3.js");

router.get("/getMobileCombustionEmissions/:userId", getMobileCombustionEmissionData);
router.get("/getstationarycombustionemission/:userId", calculateStationaryCombustionEmission);
router.get("/getindustrialprocessesemission/:userId", calculateIndustrialProcessesEmission);
router.get("/getfugitiveemission/:userId", calculateFugitiveEmissions);
router.get("/total-emissions/:userId", calculateTotalEmissions);
router.get("/purchased-electricity/:userId", getPurchasedElectricityEmission);
router.get("/purchased-steam-heat-cooling/:userId", getPurchasedSteamHeatCoolingEmission);
router.get("/totalemission-scope2/:userId", getTotalScope2Emission);
router.get("/getPurchasedGoodsServices/:userId", getPurchasedGoodsServicesEmission);
router.get("/getuseofsoldproducts/:userId", getUseSoldProductEmission);
router.get("/getendoflifetreatment/:userId", getEndOfLifeTreatmentEmission);
router.get("/totalemission-scope3/:userId", calculateTotalScope3Emissions);


module.exports = router;
