const MonthlySubmission = require("../../models/submission/MonthlySubmissionModel");
const {calculateMonthlyMobileCombustion}=require("../../utils/emissionCalculation/calculateMobileCombustion");
const {calculateMonthlyStationaryCombustion}=require("../../utils/emissionCalculation/calculateStationaryCombustion");
const {calculateMonthlyIndustrialProcesses}=require("../../utils/emissionCalculation/calculateIndustrialProcesses");
const {calculateMonthlyFugitiveEmissions}=require("../../utils/emissionCalculation/calculateFugitiveEmissions");
const {calculateMonthlyPurchasedElectricity}=require("../../utils/emissionCalculation/Scope2/calculatePurchasedElectricity");
const {calculateMonthlyPurchasedSteamHeatCooling}=require("../../utils/emissionCalculation/Scope2/calculatePurchasedSteamHeatCooling");
const {calculateMonthlyUseOfSoldProducts }=require("../../utils/emissionCalculation/Scope3/calculateUseOfSoldProducts");
const {calculateMonthlyPurchasedGoodsServices  }=require("../../utils/emissionCalculation/Scope3/calculatePurchasedGoods&ServicesEmission");
const {calculateMonthlyEndOfLifeTreatment  }=require("../../utils/emissionCalculation/Scope3/calculateEndOfLifeTreatment");

exports.submitMonthlyEnvironment = async (req, res) => {
  try {
    const { userId, month, responses } = req.body;

    // Check for duplicate month entry
    const existing = await MonthlySubmission.findOne({ userId, month });
    if (existing) {
      return res.status(400).json({ message: "Data already submitted for this month." });
    }

    const saved = await MonthlySubmission.create({ userId, month, responses });
await calculateMonthlyMobileCombustion(userId);
await calculateMonthlyStationaryCombustion(userId);
await calculateMonthlyIndustrialProcesses(userId);
await calculateMonthlyFugitiveEmissions(userId);
await calculateMonthlyPurchasedElectricity(userId);
await calculateMonthlyPurchasedSteamHeatCooling(userId);
await calculateMonthlyUseOfSoldProducts(userId);
await calculateMonthlyPurchasedGoodsServices(userId);
await calculateMonthlyEndOfLifeTreatment(userId);


    res.status(200).json({ message: "Monthly environment data saved", data: saved });
  } catch (err) {
    console.error("Submission Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
