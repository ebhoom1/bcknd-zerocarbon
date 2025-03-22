const Submission = require("../../models/Submission");
const StationaryCombustionEmissionModel = require("../../models/emissionCalculation/stationaryCombustionEmissionModel");

const calculateStationaryCombustion = async (userId) => {
  try {
    const submission = await Submission.findOne({ userId }).lean();

    if (
      !submission ||
      !submission.responses ||
      !submission.responses["Scope1:DirectEmissions_StationaryCombustion"]
    ) {
      return []; // No data
    }

    const emissionEntries = submission.responses["Scope1:DirectEmissions_StationaryCombustion"];
    if (!Array.isArray(emissionEntries) || emissionEntries.length === 0) {
      return []; // No entries
    }

    const emissionResults = [];

    for (const data of emissionEntries) {
      const fuelType = data["StationaryCombustion_Q2"];
      const fuelUnit = data["StationaryCombustion_Q3"];
      const annualFuelConsumption = parseFloat(data["StationaryCombustion_Q4"]);
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

      // ✅ Avoid duplicate save
      const exists = await StationaryCombustionEmissionModel.findOne({
        userId,
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

      emissionResults.push(recordData);
    }

    return emissionResults;

  } catch (error) {
    console.error("calculateStationaryCombustion error:", error.message);
    return [];
  }
};

module.exports = { calculateStationaryCombustion };
