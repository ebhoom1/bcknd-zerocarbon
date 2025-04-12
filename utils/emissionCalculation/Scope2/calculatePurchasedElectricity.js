


const MonthlySubmission = require("../../../models/submission/MonthlySubmissionModel");
// const CountryEmissionFactor = require("../../../models/contryEmissionFactorModel");
const PurchasedElectricityModel = require("../../../models/emissionCalculation/PurchasedElectricityModel");

const calculateMonthlyPurchasedElectricity = async (userId) => {
  console.log("electricity called");
  try {
    const submissions = await MonthlySubmission.find({ userId });

    if (!submissions.length) {
      return { success: false, message: "No monthly submissions found." };
    }

    // const countryFactor = await CountryEmissionFactor.findOne().sort({ createdAt: -1 }).lean();
    // const emissionFactor = countryFactor?.emissionFactor
    //   ? parseFloat(countryFactor.emissionFactor)
    //   : 0.7;

    const emissionFactor=0.709;

    const results = [];

    for (const sub of submissions) {
      const { month, responses } = sub;

      const elecEntries = responses?.get("Scope2:IndirectEmissions_PurchasedElectricity");
      if (!elecEntries || elecEntries.length === 0) continue;

      const elecData = elecEntries[0];
      const rawConsumption = elecData?.PurchasedElectricity_Q1 || "0";
      const electricityConsumptionKWh = parseFloat(rawConsumption);
      const source = elecData?.PurchasedElectricity_Q2 || "Not Provided";

      const emissionKgCO2e = electricityConsumptionKWh * emissionFactor;

      // ✅ Deduplication
      const exists = await PurchasedElectricityModel.findOne({
        userId,
        month,
        electricityConsumptionKWh,
        emissionFactor
      });

      if (!exists) {
        await PurchasedElectricityModel.create({
          userId,
          month,
          electricityConsumptionKWh,
          emissionFactor,
          emissionKgCO2e,
          source
        });
      }

      results.push({
        month,
        electricityConsumptionKWh,
        emissionFactor,
        emissionKgCO2e,
        source
      });
    }

    return {
      success: true,
      data: results
    };

  } catch (err) {
    console.error("calculateMonthlyPurchasedElectricity error:", err.message);
    return {
      success: false,
      message: err.message
    };
  }
};

module.exports = { calculateMonthlyPurchasedElectricity };
