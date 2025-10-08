

const MonthlySubmission = require("../../models/submission/MonthlySubmissionModel");
const StationaryCombustionEmissionModel = require("../../models/emissionCalculation/stationaryCombustionEmissionModel");

const calculateMonthlyStationaryCombustion = async (userId) => {
  try {
    const monthlySubmissions = await MonthlySubmission.find({ userId });

    const monthlyResults = {};

    for (const submission of monthlySubmissions) {
      const { month, responses } = submission;

      const entries = responses?.get("Scope1:DirectEmissions_StationaryCombustion");
      if (!Array.isArray(entries) || entries.length === 0) continue;

      monthlyResults[month] = [];

      for (const data of entries) {
        const fuelType = data["StationaryCombustion_Q2"];
        const fuelUnit = data["StationaryCombustion_Q4"];
        const annualFuelConsumption = parseFloat(data["StationaryCombustion_Q3"]);
        const emissionFactorCO2 = parseFloat(data["StationaryCombustion_Q5"]);
        const emissionFactorCH4 = parseFloat(data["StationaryCombustion_Q6"]);
        const emissionFactorN2O = parseFloat(data["StationaryCombustion_Q7"]);
        const emissionFactorSF6 = parseFloat(data["StationaryCombustion_Q8"]);
        const emissionFactorCO2e = parseFloat(data["StationaryCombustion_Q9"]);

        const totalCO2 = annualFuelConsumption * emissionFactorCO2;
        const totalCH4 = annualFuelConsumption * emissionFactorCH4;
        const totalN2O = annualFuelConsumption * emissionFactorN2O;
        const totalSF6 = annualFuelConsumption * emissionFactorSF6;
        const totalCO2e = annualFuelConsumption * emissionFactorCO2e;

        const recordData = {
          userId,
          month,
          fuelType,
          fuelUnit,
          annualFuelConsumption,
          emissionFactorCO2,
          emissionFactorCH4,
          emissionFactorN2O,
          emissionFactorSF6,
          emissionFactorCO2e,
          emission: {
            totalCO2: parseFloat(totalCO2.toFixed(3)),
            totalCH4: parseFloat(totalCH4.toFixed(6)),
            totalN2O: parseFloat(totalN2O.toFixed(6)),
            totalSF6: parseFloat(totalSF6.toFixed(6)),
            totalCO2e: parseFloat(totalCO2e.toFixed(3)),
          }
        };

        // ✅ Avoid duplicates using month too
        const exists = await StationaryCombustionEmissionModel.findOne({
          userId,
          month,
          fuelType,
          fuelUnit,
          annualFuelConsumption,
          emissionFactorCO2,
          emissionFactorCH4,
          emissionFactorN2O,
          emissionFactorSF6,
          emissionFactorCO2e,
        });

        if (!exists) {
          await StationaryCombustionEmissionModel.create(recordData);
        }

        monthlyResults[month].push(recordData);
      }
    }

    return monthlyResults;

  } catch (error) {
    console.error("calculateMonthlyStationaryCombustion error:", error.message);
    return {};
  }
};

module.exports = { calculateMonthlyStationaryCombustion };
