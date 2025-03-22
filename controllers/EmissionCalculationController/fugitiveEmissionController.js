

// const Submission = require("../../models/Submission");
// const FugitiveEmission = require("../../models/FugitiveEmissions");
// const FugitiveEmissionCalculation = require("../../models/emissionCalculation/fugitiveEmissionModel");

// const calculateFugitiveEmissions = async (req, res) => {
//   try {
//     const { userId } = req.params;

//     const submission = await Submission.findOne({ userId }).lean();
//     if (!submission || !submission.responses || !submission.responses["Scope1:DirectEmissions_FugitiveEmissions"]) {
//       return res.status(404).json({ message: "Fugitive emission data not found for this user." });
//     }

//     const entries = submission.responses["Scope1:DirectEmissions_FugitiveEmissions"];
//     const results = [];

//     for (const data of entries) {
//       // Refrigerant Emission Calculation
//       if (data?.FugitiveEmissions_Q1 && data?.FugitiveEmissions_Q2 && data?.FugitiveEmissions_Q4) {
//         const refrigerantGasType = data.FugitiveEmissions_Q2;
//         const refrigerantQuantity = parseFloat(data.FugitiveEmissions_Q4);

//         const refrigerantFactor = await FugitiveEmission.findOne({ gasType: refrigerantGasType });

//         if (refrigerantFactor) {
//           const CO2 = refrigerantQuantity * parseFloat(refrigerantFactor.CO2 || 0);
//           const CH4 = refrigerantQuantity * parseFloat(refrigerantFactor.CH4 || 0);
//           const N2O = refrigerantQuantity * parseFloat(refrigerantFactor.N2O || 0);
//           const SF6 = refrigerantQuantity * parseFloat(refrigerantFactor.SF6 || 0);
//           const CO2e = refrigerantQuantity * parseFloat(refrigerantFactor.GWP_CO2e || 0);

//           const recordData = {
//             userId,
//             category: "Refrigerant Emission",
//             gasType: refrigerantGasType,
//             emissionSource: data.FugitiveEmissions_Q3 || refrigerantFactor.source,
//             quantity: refrigerantQuantity,
//             emission: {
//               CO2: parseFloat(CO2.toFixed(3)),
//               CH4: parseFloat(CH4.toFixed(6)),
//               N2O: parseFloat(N2O.toFixed(6)),
//               SF6: parseFloat(SF6.toFixed(6)),
//               CO2e: parseFloat(CO2e.toFixed(3))
//             }
//           };

//           const exists = await FugitiveEmissionCalculation.findOne({
//             userId,
//             category: "Refrigerant Emission",
//             gasType: refrigerantGasType,
//             quantity: refrigerantQuantity,
//             emissionSource: recordData.emissionSource
//           });

//           if (!exists) await FugitiveEmissionCalculation.create(recordData);

//           results.push(recordData);
//         }
//       }

//       // Methane Leak Calculation
//       if (data?.FugitiveEmissions_Q5 && data?.FugitiveEmissions_Q6 === "Methane Leak" && data?.FugitiveEmissions_Q7) {
//         const methaneQuantity = parseFloat(data.FugitiveEmissions_Q7);
//         const methaneFactor = await FugitiveEmission.findOne({ gasType: "Methane Leak" });

//         if (methaneFactor) {
//           const CO2 = methaneQuantity * parseFloat(methaneFactor.CO2 || 0);
//           const CH4 = methaneQuantity * parseFloat(methaneFactor.CH4 || 0);
//           const N2O = methaneQuantity * parseFloat(methaneFactor.N2O || 0);
//           const SF6 = methaneQuantity * parseFloat(methaneFactor.SF6 || 0);
//           const CO2e = methaneQuantity * parseFloat(methaneFactor.GWP_CO2e || 0);

//           const recordData = {
//             userId,
//             category: "Pipeline Leak Emission",
//             gasType: "Methane Leak",
//             emissionSource: methaneFactor.source,
//             quantity: methaneQuantity,
//             emission: {
//               CO2: parseFloat(CO2.toFixed(3)),
//               CH4: parseFloat(CH4.toFixed(6)),
//               N2O: parseFloat(N2O.toFixed(6)),
//               SF6: parseFloat(SF6.toFixed(6)),
//               CO2e: parseFloat(CO2e.toFixed(3))
//             }
//           };

//           const exists = await FugitiveEmissionCalculation.findOne({
//             userId,
//             category: "Pipeline Leak Emission",
//             gasType: "Methane Leak",
//             quantity: methaneQuantity,
//             emissionSource: recordData.emissionSource
//           });

//           if (!exists) await FugitiveEmissionCalculation.create(recordData);

//           results.push(recordData);
//         }
//       }
//     }

//     return res.status(200).json({ message: "Fugitive Emissions Calculated & Saved", data: results });
//   } catch (error) {
//     console.error("Error calculating fugitive emissions:", error);
//     return res.status(500).json({ message: "Internal server error", error: error.message });
//   }
// };

// module.exports = {
//   calculateFugitiveEmissions
// };


const FugitiveEmissionCalculation = require("../../models/emissionCalculation/fugitiveEmissionModel");

const calculateFugitiveEmissions = async (req, res) => {
  try {
    const { userId } = req.params;

    const emissions = await FugitiveEmissionCalculation.find({ userId });

    if (!emissions || emissions.length === 0) {
      return res.status(404).json({
        message: "No Fugitive Emission data found for this user."
      });
    }

    const formattedData = emissions.map((item) => ({
      userId: item.userId,
      category: item.category || "",
      gasType: item.gasType || "",
      emissionSource: item.emissionSource || "",
      quantity: item.quantity || 0,
      emission: {
        CO2: item.emission?.CO2 || 0,
        CH4: item.emission?.CH4 || 0,
        N2O: item.emission?.N2O || 0,
        SF6: item.emission?.SF6 || 0,
        CO2e: item.emission?.CO2e || 0
      }
    }));

    return res.status(200).json({
      message: "Fugitive Emission data fetched successfully",
      data: formattedData
    });

  } catch (error) {
    console.error("Error fetching fugitive emission data:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message
    });
  }
};

module.exports = {
  calculateFugitiveEmissions
};
