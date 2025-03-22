const Submission = require("../../models/Submission");
const IndustrialProcess = require("../../models/IndustrialProcess");
const IndustrialProcessesEmissionModel = require("../../models/emissionCalculation/industrialProcessesEmissionModel");

const calculateIndustrialProcesses = async (userId) => {
  try {
    const submission = await Submission.findOne({ userId }).lean();

    if (
      !submission ||
      !submission.responses ||
      !submission.responses["Scope1:DirectEmissions_IndustrialProcesses"]
    ) {
      return []; // No data available
    }

    const industrialEntries = submission.responses["Scope1:DirectEmissions_IndustrialProcesses"];
    const result = [];

    for (const record of industrialEntries) {
      const industryType = record["IndustrialProcesses_Q2"];
      const emissionSource = record["IndustrialProcesses_Q3"];
      const productionQtyInKg = parseFloat(record["IndustrialProcesses_Q4"]);

      const emissionFactor = await IndustrialProcess.findOne({
        industryType,
        emissionSource
      });

      if (!emissionFactor) {
        result.push({
          industryType,
          emissionSource,
          productionQtyInKg,
          emission: "Emission factor not found"
        });
        continue;
      }

      // Normalize quantity based on unit in emission factor
      let normalizedQty = productionQtyInKg;
      if (emissionFactor.unit === "kg/T") {
        normalizedQty = productionQtyInKg / 1000;
      }

      const totalCO2 = normalizedQty * parseFloat(emissionFactor.CO2 || 0);
      const totalCH4 = normalizedQty * parseFloat(emissionFactor.CH4 || 0);
      const totalN2O = normalizedQty * parseFloat(emissionFactor.N2O || 0);
      const totalCO2e = parseFloat((normalizedQty * parseFloat(emissionFactor.CO2e || 0)).toFixed(3));

      const recordData = {
        userId,
        industryType,
        emissionSource,
        unit: emissionFactor.unit,
        productionQtyInKg,
        normalizedQty,
        emissionFactor: {
          CO2: parseFloat(emissionFactor.CO2 || 0),
          CH4: parseFloat(emissionFactor.CH4 || 0),
          N2O: parseFloat(emissionFactor.N2O || 0),
          CO2e: parseFloat(emissionFactor.CO2e || 0)
        },
        emission: {
          CO2: parseFloat(totalCO2.toFixed(3)),
          CH4: parseFloat(totalCH4.toFixed(6)),
          N2O: parseFloat(totalN2O.toFixed(6)),
          CO2e: totalCO2e
        }
      };

      // ✅ Check for duplicates before saving
      const exists = await IndustrialProcessesEmissionModel.findOne({
        userId,
        industryType,
        emissionSource,
        productionQtyInKg,
        normalizedQty
      });

      if (!exists) {
        await IndustrialProcessesEmissionModel.create(recordData);
      }

      result.push(recordData);
    }

    return result;

  } catch (error) {
    console.error("calculateIndustrialProcesses error:", error.message);
    return [];
  }
};

module.exports = { calculateIndustrialProcesses };
