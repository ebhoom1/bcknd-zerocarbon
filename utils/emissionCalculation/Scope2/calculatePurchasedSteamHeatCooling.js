// controllers/scope2/calculatePurchasedSteamHeatCooling.js

const Submission = require("../../../models/Submission");
const PurchasedSteamHeatCoolingModel = require("../../../models/emissionCalculation/PurchasedSteamHeatCoolingModel");

const calculatePurchasedSteamHeatCooling = async (userId) => {
  try {
    const submission = await Submission.findOne({ userId }).lean();

    if (!submission || !submission.responses || !submission.responses["Scope2:IndirectEmissions_PurchasedSteam,Heat,orCooling"]) {
      throw new Error("Steam/Heat/Cooling data not found in submission");
    }

    const steamData = submission.responses["Scope2:IndirectEmissions_PurchasedSteam,Heat,orCooling"][0];
    const consumption = parseFloat(steamData?.["PurchasedSteam,Heat,orCooling_Q1"]?.replace(/[^\d.]/g, "") || "0");
    const unit = steamData?.["PurchasedSteam,Heat,orCooling_Q2"];   
    const emissionFactor = parseFloat(steamData?.["PurchasedSteam,Heat,orCooling_Q3"]?.replace(/[^\d.]/g, "") || "0");
    const considerLosses = steamData?.["PurchasedSteam,Heat,orCooling_Q4"] === true || steamData?.["PurchasedSteam,Heat,orCooling_Q4"]?.toString().toLowerCase() === "yes";
const lossPercent = considerLosses ? parseFloat(steamData?.["PurchasedSteam,Heat,orCooling_Q5"] || 0) : 0;

    let totalEmission = consumption * emissionFactor;
    if (considerLosses && lossPercent > 0) {
      totalEmission += totalEmission * (lossPercent / 100);
    }

    // ✅ Check for duplicate
    const duplicate = await PurchasedSteamHeatCoolingModel.findOne({
      userId,
      consumption,
      unit,
      emissionFactor,
      considerLosses,
      lossPercent
    }).lean();

    if (!duplicate) {
      const newRecord = new PurchasedSteamHeatCoolingModel({
        userId,
        consumption,
        unit,
        emissionFactor,
        considerLosses,
        lossPercent,
        totalEmission
      });

      await newRecord.save();
    } else {
      console.log("Duplicate data found. Not saving again.");
    }

    return {
      success: true,
      data: {
        consumption,
        unit,
        emissionFactor,
        lossPercent,
        considerLosses,
        totalEmission
      }
    };
  } catch (err) {
    console.error("Steam/Heat/Cooling Emission Calculation Error:", err.message);
    return {
      success: false,
      message: err.message
    };
  }
};

module.exports = { calculatePurchasedSteamHeatCooling };
