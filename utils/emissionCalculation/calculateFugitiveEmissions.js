// const Submission = require("../../models/Submission");
// const FugitiveEmission = require("../../models/FugitiveEmissions");
// const FugitiveEmissionCalculation = require("../../models/emissionCalculation/fugitiveEmissionModel");

// const calculateFugitiveEmissions = async (userId) => {
//   try {
//     const submission = await Submission.findOne({ userId }).lean();
//     if (!submission || !submission.responses || !submission.responses["Scope1:DirectEmissions_FugitiveEmissions"]) {
//       return []; // No data found
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

//     return results;

//   } catch (error) {
//     console.error("calculateFugitiveEmissions error:", error.message);
//     return [];
//   }
// };

// module.exports = { calculateFugitiveEmissions };


const MonthlySubmission = require("../../models/submission/MonthlySubmissionModel");
const FugitiveEmission = require("../../models/FugitiveEmissions");
const FugitiveEmissionCalculation = require("../../models/emissionCalculation/fugitiveEmissionModel");

const calculateMonthlyFugitiveEmissions = async (userId) => {
  try {
    const submissions = await MonthlySubmission.find({ userId });
    const resultByMonth = {};

    for (const submission of submissions) {
      const { month, responses } = submission;
      const entries = responses?.get("Scope1:DirectEmissions_FugitiveEmissions");
      if (!Array.isArray(entries) || entries.length === 0) continue;

      resultByMonth[month] = [];

      for (const data of entries) {
        // Refrigerant Emission
        if (data?.FugitiveEmissions_Q1 && data?.FugitiveEmissions_Q2 && data?.FugitiveEmissions_Q4) {
          const refrigerantGasType = data.FugitiveEmissions_Q2;
          const refrigerantQuantity = parseFloat(data.FugitiveEmissions_Q4);

          const refrigerantFactor = await FugitiveEmission.findOne({ gasType: refrigerantGasType });
          if (refrigerantFactor) {
            const CO2 = refrigerantQuantity * parseFloat(refrigerantFactor.CO2 || 0);
            const CH4 = refrigerantQuantity * parseFloat(refrigerantFactor.CH4 || 0);
            const N2O = refrigerantQuantity * parseFloat(refrigerantFactor.N2O || 0);
            const SF6 = refrigerantQuantity * parseFloat(refrigerantFactor.SF6 || 0);
            const CO2e = refrigerantQuantity * parseFloat(refrigerantFactor.GWP_CO2e || 0);

            const recordData = {
              userId,
              month,
              category: "Refrigerant Emission",
              gasType: refrigerantGasType,
              emissionSource: data.FugitiveEmissions_Q3 || refrigerantFactor.source,
              quantity: refrigerantQuantity,
              emission: {
                CO2: parseFloat(CO2.toFixed(3)),
                CH4: parseFloat(CH4.toFixed(6)),
                N2O: parseFloat(N2O.toFixed(6)),
                SF6: parseFloat(SF6.toFixed(6)),
                CO2e: parseFloat(CO2e.toFixed(3))
              }
            };

            const exists = await FugitiveEmissionCalculation.findOne({
              userId,
              month,
              category: "Refrigerant Emission",
              gasType: refrigerantGasType,
              quantity: refrigerantQuantity,
              emissionSource: recordData.emissionSource
            });

            if (!exists) await FugitiveEmissionCalculation.create(recordData);
            resultByMonth[month].push(recordData);
          }
        }

        // Methane Leak Emission
        if (
          data?.FugitiveEmissions_Q5 &&
          data?.FugitiveEmissions_Q6 === "Methane Leak" &&
          data?.FugitiveEmissions_Q7
        ) {
          const methaneQuantity = parseFloat(data.FugitiveEmissions_Q7);
          const methaneFactor = await FugitiveEmission.findOne({ gasType: "Methane Leak" });

          if (methaneFactor) {
            const CO2 = methaneQuantity * parseFloat(methaneFactor.CO2 || 0);
            const CH4 = methaneQuantity * parseFloat(methaneFactor.CH4 || 0);
            const N2O = methaneQuantity * parseFloat(methaneFactor.N2O || 0);
            const SF6 = methaneQuantity * parseFloat(methaneFactor.SF6 || 0);
            const CO2e = methaneQuantity * parseFloat(methaneFactor.GWP_CO2e || 0);

            const recordData = {
              userId,
              month,
              category: "Pipeline Leak Emission",
              gasType: "Methane Leak",
              emissionSource: methaneFactor.source,
              quantity: methaneQuantity,
              emission: {
                CO2: parseFloat(CO2.toFixed(3)),
                CH4: parseFloat(CH4.toFixed(6)),
                N2O: parseFloat(N2O.toFixed(6)),
                SF6: parseFloat(SF6.toFixed(6)),
                CO2e: parseFloat(CO2e.toFixed(3))
              }
            };

            const exists = await FugitiveEmissionCalculation.findOne({
              userId,
              month,
              category: "Pipeline Leak Emission",
              gasType: "Methane Leak",
              quantity: methaneQuantity,
              emissionSource: recordData.emissionSource
            });

            if (!exists) await FugitiveEmissionCalculation.create(recordData);
            resultByMonth[month].push(recordData);
          }
        }
      }
    }

    return resultByMonth;

  } catch (error) {
    console.error("calculateMonthlyFugitiveEmissions error:", error.message);
    return {};
  }
};

module.exports = { calculateMonthlyFugitiveEmissions };
