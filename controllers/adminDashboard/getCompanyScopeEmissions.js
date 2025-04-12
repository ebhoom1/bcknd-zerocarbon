// 📦 CONTROLLER: Get CO2e by Company and Scope Monthly
const User = require("../../models/User");
const MobileCombustion = require("../../models/emissionCalculation/mobileCombustionEmissionModel");
const StationaryCombustion = require("../../models/emissionCalculation/stationaryCombustionEmissionModel");
const IndustrialProcesses = require("../../models/emissionCalculation/industrialProcessesEmissionModel");
const FugitiveEmissions = require("../../models/emissionCalculation/fugitiveEmissionModel");
const PurchasedElectricity = require("../../models/emissionCalculation/PurchasedElectricityModel");
const PurchasedSteamHeatCooling = require("../../models/emissionCalculation/PurchasedSteamHeatCoolingModel");
const UseOfSoldProducts = require("../../models/emissionCalculation/UseSoldProductEmissionModel");
const PurchasedGoodsServices = require("../../models/emissionCalculation/PurchasedGoodsServicesModel");
const EndOfLifeTreatment = require("../../models/emissionCalculation/EndOfLifeTreatmentModel");

const modelScopes = [
  { scope: "Scope 1", model: MobileCombustion, getCO2e: (e) => parseFloat(e.emission?.CO2e || 0) },
  { scope: "Scope 1", model: StationaryCombustion, getCO2e: (e) => parseFloat(e.emission?.totalCO2e || 0) },
  { scope: "Scope 1", model: IndustrialProcesses, getCO2e: (e) => parseFloat(e.emission?.CO2e || 0) },
  { scope: "Scope 1", model: FugitiveEmissions, getCO2e: (e) => parseFloat(e.emission?.CO2e || 0) },
  { scope: "Scope 2", model: PurchasedElectricity, getCO2e: (e) => parseFloat(e.emissionKgCO2e || 0) },
  { scope: "Scope 2", model: PurchasedSteamHeatCooling, getCO2e: (e) => parseFloat(e.totalEmission || 0) },
  { scope: "Scope 3", model: UseOfSoldProducts, getCO2e: (e) => parseFloat(e.CO2e || 0) },
  { scope: "Scope 3", model: PurchasedGoodsServices, getCO2e: (e) => parseFloat(e.emissionCO2e || 0) },
  { scope: "Scope 3", model: EndOfLifeTreatment, getCO2e: (e) => parseFloat(e.CO2e || 0) },
];

const getCompanyScopeEmissions = async (req, res) => {
  try {
    const users = await User.find({ userType: "user" });

    const companyData = {}; // { "Company Name": { scopeTotals, monthlyByScope } }

    for (const user of users) {
      const company = user.companyName;
      if (!companyData[company]) {
        companyData[company] = {
          monthlyByScope: {}, // { month: { scope1, scope2, scope3 } }
          scopeTotals: { "Scope 1": 0, "Scope 2": 0, "Scope 3": 0 },
        };
      }

      for (const { scope, model: Model, getCO2e } of modelScopes) {
        const entries = await Model.find({ userId: user._id });

        for (const entry of entries) {
          const co2e = getCO2e(entry);
          const month = entry.month || "Unknown";
          if (!companyData[company].monthlyByScope[month]) {
            companyData[company].monthlyByScope[month] = {
              "Scope 1": 0,
              "Scope 2": 0,
              "Scope 3": 0,
            };
          }
          if (!isNaN(co2e)) {
            companyData[company].monthlyByScope[month][scope] += co2e;
            companyData[company].scopeTotals[scope] += co2e;
          }
        }
      }
    }

    res.status(200).json({ success: true, data: companyData });
  } catch (err) {
    console.error("❌ Error generating company emissions chart:", err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

module.exports = { getCompanyScopeEmissions };
