// controllers/scope2/calculatePurchasedElectricity.js
const Submission = require("../../../models/Submission");
const CountryEmissionFactor = require("../../../models/contryEmissionFactorModel");
const PurchasedElectricityModel = require("../../../models/emissionCalculation/PurchasedElectricityModel");

const calculatePurchasedElectricity = async (userId) => {
  try {
    const submission = await Submission.findOne({ userId }).lean();

    if (!submission || !submission.responses || !submission.responses["Scope2:IndirectEmissions_PurchasedElectricity"]) {
      throw new Error("Purchased Electricity data not found in submission");
    }

    const elecData = submission.responses["Scope2:IndirectEmissions_PurchasedElectricity"][0];
    const rawConsumption = elecData?.PurchasedElectricity_Q1?.replace(/[^\d.]/g, '') || "0";
    const electricityConsumptionKWh = parseFloat(rawConsumption);
    console.log("electricityConsumptionKWh:",electricityConsumptionKWh);

    // Get emission factor
    const countryFactor = await CountryEmissionFactor.findOne().sort({ createdAt: -1 }).lean();
    let emissionFactor = 0.7; // Default fallback
    if (countryFactor?.emissionFactor) {
      emissionFactor = parseFloat(countryFactor.emissionFactor);
    }
console.log("emissionfactor:",emissionFactor);
    const emissionKgCO2e = electricityConsumptionKWh * emissionFactor;
    console.log("emission:",emissionKgCO2e);

    const source = elecData?.PurchasedElectricity_Q2 || "Not Provided";

    // ✅ Check for exact duplicate entry
    const duplicate = await PurchasedElectricityModel.findOne({
      userId,
      electricityConsumptionKWh,
      emissionFactor
    }).lean();

    if (!duplicate) {
      const purchasedElectricity = new PurchasedElectricityModel({
        userId,
        electricityConsumptionKWh,
        emissionFactor,
        emissionKgCO2e,
        source
      });

      await purchasedElectricity.save();
    } else {
      console.log("Duplicate data found. Not saving again.");
    }

    return {
      success: true,
      data: {
        electricityConsumptionKWh,
        emissionFactor,
        emissionKgCO2e
      }
    };
  } catch (err) {
    console.error("Purchased Electricity Calculation Error:", err.message);
    return {
      success: false,
      message: err.message
    };
  }
};

module.exports = { calculatePurchasedElectricity };
