const MonthlySubmission = require("../../models/submission/MonthlySubmissionModel");
const { generateBRSRSectionAData } = require("../../utils/report/generateBRSRSectionAData");
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
    console.log("responses:",responses);

    if (!userId || !month || !responses) {
      return res.status(400).json({ message: "userId, month, and responses are required." });
    }

    let submission = await MonthlySubmission.findOne({ userId, month });

    if (submission) {
      // ✅ Merge: Update only provided keys, keep old ones
      Object.entries(responses).forEach(([key, newEntry]) => {
        if (submission.responses.has(key)) {
          const existing = submission.responses.get(key);
          const merged = Array.isArray(existing)
            ? [...existing, ...newEntry]
            : newEntry; // Overwrite scalar
          submission.responses.set(key, merged);
        } else {
          submission.responses.set(key, newEntry);
        }
      });

      await submission.save();
    } else {
      // ✅ New Submission
      submission = await MonthlySubmission.create({ userId, month, responses });
    }

    // 🔁 Run only applicable emission calculations
    if (responses["Scope1:DirectEmissions_MobileCombustion"]) await calculateMonthlyMobileCombustion(userId);
    if (responses["Scope1:DirectEmissions_StationaryCombustion"]) await calculateMonthlyStationaryCombustion(userId);
    if (responses["Scope1:DirectEmissions_IndustrialProcesses"]) await calculateMonthlyIndustrialProcesses(userId);
    if (responses["Scope1:DirectEmissions_FugitiveEmissions"]) await calculateMonthlyFugitiveEmissions(userId);
    if (responses["Scope2:IndirectEmissions_PurchasedElectricity"]) await calculateMonthlyPurchasedElectricity(userId);
    if (responses["Scope2:IndirectEmissions_PurchasedSteamHeatorCooling"]) await calculateMonthlyPurchasedSteamHeatCooling(userId);
    if (responses["Scope3:ValueChainEmissions_UseofSoldProducts"]) await calculateMonthlyUseOfSoldProducts(userId);
    if (responses["Scope3:ValueChainEmissions_PurchasedGoodsServices"]) await calculateMonthlyPurchasedGoodsServices(userId);
    if (responses["Scope3:ValueChainEmissions_EndofLifeTreatment"]) await calculateMonthlyEndOfLifeTreatment(userId);

await generateBRSRSectionAData(userId);


    res.status(200).json({
      message: submission.isNew
        ? "New monthly submission saved."
        : "Monthly submission updated successfully.",
      data: submission,
    });

  } catch (error) {
    console.error("submitMonthlyEnvironment error:", error);
    res.status(500).json({ message: "Server error during monthly submission.", error: error.message });
  }
};

// GET Monthly USER SUBMISSION (BY USER ID)
exports.getMonthlyUserSubmission = async (req, res) => {
  try {
    const { userId } = req.params;
    const submission = await MonthlySubmission.findOne({ userId });

    if (!submission) {
      return res.status(404).json({ message: "No submission found for this user" });
    }

    res.status(200).json(submission);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error: Unable to fetch data" });
  }
};


// exports.getMonthlyUserSubmission = async (req, res) => {
//   const { userId } = req.params;
//   const { month } = req.query;

//   const submission = await MonthlySubmission.findOne({ userId, month });

//   if (!submission) return res.status(404).json({ message: "No data found" });

//   res.status(200).json({
//     responses: submission.responses || {},
//     missingKeys: submission.missingKeys || [],
//   });
// };

