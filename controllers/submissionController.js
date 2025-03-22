// const Submission = require("../models/Submission");

// const { calculateMobileCombustion } = require("../utils/emissionCalculation/calculateMobileCombustion");
// const { calculateStationaryCombustion } = require("../utils/emissionCalculation/calculateStationaryCombustion");


// exports.submitData = async (req, res) => {
//   try {
//     const { userId, responses } = req.body;
//     console.log("responses:", responses);
    
//     if (!userId || !responses) {
//       return res.status(400).json({ error: "User ID and responses are required" });
//     }

//     let submission = await Submission.findOne({ userId });

//     if (submission) {
//       // ✅ Merge each key
//       Object.keys(responses).forEach((key) => {
//         const newEntries = responses[key];

//         // If previous entries exist, merge them
//         if (submission.responses.has(key)) {
//           const existingEntries = submission.responses.get(key);
//           const mergedEntries = Array.isArray(existingEntries)
//             ? [...existingEntries, ...newEntries]
//             : [...newEntries]; // fallback if somehow not array
//           submission.responses.set(key, mergedEntries);
//         } else {
//           // If key doesn't exist, just set it
//           submission.responses.set(key, newEntries);
//         }
//       });

//       await submission.save();
//        // 🚀 Call emission calculation on submit
//     await calculateMobileCombustion(userId);

//       res.status(200).json({ message: "Data merged successfully", submission });
//     } else {
//       // New submission
//       submission = new Submission({ userId, responses });
//       await submission.save();
//        // 🚀 Call emission calculation on submit
//     await calculateMobileCombustion(userId);

//       res.status(200).json({ message: "Data submitted successfully", submission });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Server Error: Unable to submit data" });
//   }
// };


const Submission = require("../models/Submission");

const { calculateMobileCombustion } = require("../utils/emissionCalculation/calculateMobileCombustion");
const { calculateStationaryCombustion } = require("../utils/emissionCalculation/calculateStationaryCombustion");
const { calculateIndustrialProcesses } = require("../utils/emissionCalculation/calculateIndustrialProcesses");
const { calculateFugitiveEmissions } = require("../utils/emissionCalculation/calculateFugitiveEmissions");
const { calculatePurchasedElectricity } = require("../utils/emissionCalculation/Scope2/calculatePurchasedElectricity");
const { calculatePurchasedSteamHeatCooling } = require("../utils/emissionCalculation/Scope2/calculatePurchasedSteamHeatCooling");
const { calculatePurchasedGoodsServicesEmission } = require("../utils/emissionCalculation/Scope3/calculatePurchasedGoods&ServicesEmission");
const { calculateUseOfSoldProducts } = require("../utils/emissionCalculation/Scope3/calculateUseOfSoldProducts");
const { calculateEndOfLifeTreatment } = require("../utils/emissionCalculation/Scope3/calculateEndOfLifeTreatment");

exports.submitData = async (req, res) => {
  try {
    const { userId, responses } = req.body;
    console.log("responses:", responses);
    
    if (!userId || !responses) {
      return res.status(400).json({ error: "User ID and responses are required" });
    }

    let submission = await Submission.findOne({ userId });

    if (submission) {
      // ✅ Merge each key
      Object.keys(responses).forEach((key) => {
        const newEntries = responses[key];

        if (submission.responses.has(key)) {
          const existingEntries = submission.responses.get(key);
          const mergedEntries = Array.isArray(existingEntries)
            ? [...existingEntries, ...newEntries]
            : [...newEntries];
          submission.responses.set(key, mergedEntries);
        } else {
          submission.responses.set(key, newEntries);
        }
      });

      await submission.save();

    } else {
      // New submission
      submission = new Submission({ userId, responses });
      await submission.save();
    }

    // 🚀 Trigger Emission Calculations
    await calculateMobileCombustion(userId);
    await calculateStationaryCombustion(userId);
    await calculateIndustrialProcesses(userId);
    await calculateFugitiveEmissions(userId); 
    await calculatePurchasedElectricity(userId);
    await calculatePurchasedSteamHeatCooling(userId);
    await calculatePurchasedGoodsServicesEmission(userId);
    await calculateUseOfSoldProducts(userId);
    await calculateEndOfLifeTreatment(userId);

    res.status(200).json({ message: "Data submitted & emissions calculated successfully", submission });

  } catch (error) {
    console.error("submitData error:", error);
    res.status(500).json({ error: "Server Error: Unable to submit data" });
  }
};


// GET USER SUBMISSION (BY USER ID)
exports.getUserSubmission = async (req, res) => {
  try {
    const { userId } = req.params;
    const submission = await Submission.findOne({ userId });

    if (!submission) {
      return res.status(404).json({ message: "No submission found for this user" });
    }

    res.status(200).json(submission);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error: Unable to fetch data" });
  }
};

//  GET ALL SUBMISSIONS (ADMIN USE-CASE)
exports.getAllSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find();
    res.status(200).json(submissions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error: Unable to fetch all submissions" });
  }
};


