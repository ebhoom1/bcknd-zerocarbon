

const MobileCombustion = require("../../models/emissionCalculation/mobileCombustionEmissionModel");
const StationaryCombustion = require("../../models/emissionCalculation/stationaryCombustionEmissionModel");
const IndustrialProcesses = require("../../models/emissionCalculation/industrialProcessesEmissionModel");
const FugitiveEmissions = require("../../models/emissionCalculation/fugitiveEmissionModel");
const PurchasedElectricity = require("../../models/emissionCalculation/PurchasedElectricityModel");
const PurchasedSteamHeatCooling = require("../../models/emissionCalculation/PurchasedSteamHeatCoolingModel");
const UseOfSoldProducts = require("../../models/emissionCalculation/UseSoldProductEmissionModel");
const PurchasedGoodsServices = require("../../models/emissionCalculation/PurchasedGoodsServicesModel");
const EndOfLifeTreatment = require("../../models/emissionCalculation/EndOfLifeTreatmentModel");

const models = [
  { name: "MobileCombustion", model: MobileCombustion, getCO2e: (e) => parseFloat(e.emission?.CO2e || 0) },
  { name: "StationaryCombustion", model: StationaryCombustion, getCO2e: (e) => parseFloat(e.emission?.totalCO2e || 0) },
  { name: "IndustrialProcesses", model: IndustrialProcesses, getCO2e: (e) => parseFloat(e.emission?.CO2e || 0) },
  { name: "FugitiveEmissions", model: FugitiveEmissions, getCO2e: (e) => parseFloat(e.emission?.CO2e || 0) },
  { name: "PurchasedElectricity", model: PurchasedElectricity, getCO2e: (e) => parseFloat(e.emissionKgCO2e || 0) },
  { name: "PurchasedSteamHeatCooling", model: PurchasedSteamHeatCooling, getCO2e: (e) => parseFloat(e.totalEmission || 0) },
  { name: "UseOfSoldProducts", model: UseOfSoldProducts, getCO2e: (e) => parseFloat(e.CO2e || 0) },
  { name: "PurchasedGoodsServices", model: PurchasedGoodsServices, getCO2e: (e) => parseFloat(e.emissionCO2e || 0) },
  { name: "EndOfLifeTreatment", model: EndOfLifeTreatment, getCO2e: (e) => parseFloat(e.CO2e || 0) },
];

const getMonthlyTotalEmissions = async (req, res) => {
  try {
    const { userId } = req.params;
    const monthlyMap = {};

    for (const { name, model: Model, getCO2e } of models) {
      const entries = await Model.find({ userId });
      // console.log(`\n--- ${name} ---`);

      for (const entry of entries) {
        const { month } = entry;
        const co2e = getCO2e(entry);
        // console.log(`Month: ${month}, CO2e: ${co2e}`);

        if (!month) continue;

        if (!monthlyMap[month]) monthlyMap[month] = 0;
        monthlyMap[month] += isNaN(co2e) ? 0 : co2e;
      }
    }

    // Format for frontend chart
    const formatted = Object.entries(monthlyMap)
      .map(([month, emissions]) => ({ month, emissions }))
      .sort((a, b) => new Date(`1 ${a.month}`) - new Date(`1 ${b.month}`));

    // Group by year
    const byYear = {};
    for (const item of formatted) {
      const year = item.month.split("-")[1]; // e.g., "Apr-2025" => "2025"
      if (!byYear[year]) byYear[year] = [];
      byYear[year].push(item);
    }

    // console.log("\n=== Final Monthly CO2e Total ===");
    // console.log(byYear);

    res.status(200).json({ success: true, data: byYear });
  } catch (err) {
    console.error("Error calculating total emissions:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = {getMonthlyTotalEmissions};
