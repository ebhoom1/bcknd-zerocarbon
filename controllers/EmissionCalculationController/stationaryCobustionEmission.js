
// const Submission = require("../../models/Submission");
// const StationaryCombustionEmissionModel = require("../../models/emissionCalculation/stationaryCombustionEmissionModel");

// const calculateStationaryCombustionEmission = async (req, res) => {
//   try {
//     const { userId } = req.params;

//     const submission = await Submission.findOne({ userId }).lean();

//     if (
//       !submission ||
//       !submission.responses ||
//       !submission.responses["Scope1:DirectEmissions_StationaryCombustion"]
//     ) {
//       return res.status(404).json({
//         message: "Stationary Combustion data not found for user."
//       });
//     }

//     const emissionEntries = submission.responses["Scope1:DirectEmissions_StationaryCombustion"];
//     if (!Array.isArray(emissionEntries) || emissionEntries.length === 0) {
//       return res.status(404).json({
//         message: "No Stationary Combustion emission entries found."
//       });
//     }

//     const emissionResults = [];

//     for (const data of emissionEntries) {
//       const fuelType = data["StationaryCombustion_Q2"];
//       const fuelUnit = data["StationaryCombustion_Q3"];
//       const annualFuelConsumption = parseFloat(data["StationaryCombustion_Q4"]);
//       const emissionFactorCO2 = parseFloat(data["StationaryCombustion_Q5"]);
//       const emissionFactorCH4 = parseFloat(data["StationaryCombustion_Q6"]);
//       const emissionFactorN2O = parseFloat(data["StationaryCombustion_Q7"]);
//       const emissionFactorSF6 = parseFloat(data["StationaryCombustion_Q8"]);
//       const emissionFactorCO2e = parseFloat(data["StationaryCombustion_Q9"]);

//       const totalCO2 = annualFuelConsumption * emissionFactorCO2;
//       const totalCH4 = annualFuelConsumption * emissionFactorCH4;
//       const totalN2O = annualFuelConsumption * emissionFactorN2O;
//       const totalSF6 = annualFuelConsumption * emissionFactorSF6;
//       const totalCO2e = annualFuelConsumption * emissionFactorCO2e;

//       const recordData = {
//         userId,
//         fuelType,
//         fuelUnit,
//         annualFuelConsumption,
//         emissionFactorCO2,
//         emissionFactorCH4,
//         emissionFactorN2O,
//         emissionFactorSF6,
//         emissionFactorCO2e,
//         emission: {
//           totalCO2: parseFloat(totalCO2.toFixed(3)),
//           totalCH4: parseFloat(totalCH4.toFixed(6)),
//           totalN2O: parseFloat(totalN2O.toFixed(6)),
//           totalSF6: parseFloat(totalSF6.toFixed(6)),
//           totalCO2e: parseFloat(totalCO2e.toFixed(3)),
//         }
//       };

//       // ✅ Check for duplicate before saving
//       const exists = await StationaryCombustionEmissionModel.findOne({
//         userId,
//         fuelType,
//         fuelUnit,
//         annualFuelConsumption,
//         emissionFactorCO2,
//         emissionFactorCH4,
//         emissionFactorN2O,
//         emissionFactorSF6,
//         emissionFactorCO2e,
//       });

//       if (!exists) {
//         await StationaryCombustionEmissionModel.create(recordData);
//       }

//       emissionResults.push(recordData);
//     }

//     return res.status(200).json({
//       message: "Stationary Combustion Emissions Calculated & Saved",
//       data: emissionResults
//     });

//   } catch (error) {
//     console.error("Error calculating stationary combustion emission:", error);
//     return res.status(500).json({
//       message: "Internal server error",
//       error: error.message
//     });
//   }
// };

// module.exports = {
//   calculateStationaryCombustionEmission
// };


const StationaryCombustionEmission = require("../../models/emissionCalculation/stationaryCombustionEmissionModel");

const calculateStationaryCombustionEmission = async (req, res) => {
  try {
    const { userId } = req.params;

    const emissions = await StationaryCombustionEmission.find({ userId });

    if (!emissions || emissions.length === 0) {
      return res.status(404).json({
        message: "No Stationary Combustion Emission data found for this user."
      });
    }

    const formattedData = emissions.map((item) => ({
      userId: item.userId,
      fuelType: item.fuelType,
      fuelUnit: item.fuelUnit,
      annualFuelConsumption: item.annualFuelConsumption,
      emissionFactorCO2: item.emissionFactorCO2,
      emissionFactorCH4: item.emissionFactorCH4,
      emissionFactorN2O: item.emissionFactorN2O,
      emissionFactorSF6: item.emissionFactorSF6,
      emissionFactorCO2e: item.emissionFactorCO2e,
      emission: {
        totalCO2: item.emission?.totalCO2 || 0,
        totalCH4: item.emission?.totalCH4 || 0,
        totalN2O: item.emission?.totalN2O || 0,
        totalSF6: item.emission?.totalSF6 || 0,
        totalCO2e: item.emission?.totalCO2e || 0
      }
    }));

    return res.status(200).json({
      message: "Stationary Combustion Emission data fetched successfully",
      data: formattedData
    });

  } catch (error) {
    console.error("Error fetching stationary combustion emission:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message
    });
  }
};

module.exports = {
  calculateStationaryCombustionEmission
};
