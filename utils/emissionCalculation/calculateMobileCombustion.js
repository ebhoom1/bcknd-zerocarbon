// const Submission = require("../../models/Submission");
// const MobileCombustion = require("../../models/MobileCombustion");
// const MobileCombustionEmissionModel = require("../../models/emissionCalculation/mobileCombustionEmissionModel");

// // Fuel Densities in Ton/L
// const fuelDensitiesTon = {
//   petrol: 0.00074,
//   diesel: 0.00083,
//   lpg: 0.00054,
//   cng: 0.00042,
// };

// const calculateMobileCombustion = async (userId) => {
//   try {
//     const submission = await Submission.findOne({ userId });

//     if (!submission || !submission.responses || !submission.responses.get("Scope1:DirectEmissions_MobileCombustion")) {
//       return []; // No data available
//     }

//     const mobileData = submission.responses.get("Scope1:DirectEmissions_MobileCombustion");
//     const result = [];

//     for (const record of mobileData) {
//       const totalvehicles = record["MobileCombustion_Q1"];
//       const vehicletype = record["MobileCombustion_Q2"];
//       const vehiclename = record["MobileCombustion_Q3"];
//       const fueltypeRaw = record["MobileCombustion_Q4"] || "";
//       const fueltype = fueltypeRaw.toLowerCase().trim().replace(/\.$/, "");
//       const fuelcombustion = parseFloat(record["MobileCombustion_Q5"]) || 0;
//       const vehicledistance = record["MobileCombustion_Q6"];

//       const emissionData = await MobileCombustion.findOne({
//         vehicleType: { $regex: new RegExp(vehicletype, "i") },
//         fuelType: { $regex: new RegExp(fueltype, "i") },
//       });

//       let recordData;

//       if (!emissionData) {
//         recordData = {
//           userId,
//           totalvehicles,
//           vehicletype,
//           vehiclename,
//           fueltype,
//           fuelcombustion,
//           vehicledistance,
//           CO2: "Not Found",
//           CH4: "Not Found",
//           N2O: "Not Found",
//           CO2e: "Not Found",
//           emission: {
//             CO2: "Not Found",
//             CH4: "Not Found",
//             N2O: "Not Found",
//             CO2e: "Not Found",
//           }
//         };
//       } else if (fueltype === "cng") {
//         const fuelcombustionTon = fuelcombustion * 0.001;
//         const emissionCO2 = fuelcombustionTon * parseFloat(emissionData.CO2 || 0);
//         const emissionCH4 = fuelcombustionTon * parseFloat(emissionData.CH4 || 0);
//         const emissionN2O = fuelcombustionTon * parseFloat(emissionData.N2O || 0);
//         const emissionCO2e = fuelcombustionTon * parseFloat(emissionData.CO2e || 0);
//         const fuelcombustionKg = fuelcombustionTon * 1000;
//         const totalEnergyMJ = fuelcombustionKg * parseFloat(emissionData.NCV || 0);

//         recordData = {
//           userId,
//           totalvehicles,
//           vehicletype,
//           vehiclename,
//           fueltype,
//           fuelcombustion,
//           vehicledistance,
//           CO2: emissionData.CO2,
//           CH4: emissionData.CH4,
//           N2O: emissionData.N2O,
//           CO2e: emissionData.CO2e,
//           emission: {
//             CO2: emissionCO2.toFixed(3),
//             CH4: emissionCH4.toFixed(6),
//             N2O: emissionN2O.toFixed(6),
//             CO2e: emissionCO2e.toFixed(3),
//             totalEnergyMJ: parseFloat(totalEnergyMJ.toFixed(2)),
//           }
//         };
//       } else {
//         const densityTon = fuelDensitiesTon[fueltype] || 0;
//         const CO2_kgL = parseFloat(emissionData.CO2 || 0) * densityTon;
//         const CH4_kgL = parseFloat(emissionData.CH4 || 0) * densityTon;
//         const N2O_kgL = parseFloat(emissionData.N2O || 0) * densityTon;
//         const CO2e_kgL = parseFloat(emissionData.CO2e || 0) * densityTon;

//         const emissionCO2 = fuelcombustion * CO2_kgL;
//         const emissionCH4 = fuelcombustion * CH4_kgL;
//         const emissionN2O = fuelcombustion * N2O_kgL;
//         const emissionCO2e = fuelcombustion * CO2e_kgL;

//         const fuelcombustionKg = fuelcombustion * (densityTon * 1000);
//         const totalEnergyMJ = fuelcombustionKg * parseFloat(emissionData.NCV || 0);

//         recordData = {
//           userId,
//           totalvehicles,
//           vehicletype,
//           vehiclename,
//           fueltype,
//           fuelcombustion,
//           vehicledistance,
//           CO2: CO2_kgL.toFixed(3),
//           CH4: CH4_kgL.toFixed(6),
//           N2O: N2O_kgL.toFixed(6),
//           CO2e: CO2e_kgL.toFixed(3),
//           emission: {
//             CO2: emissionCO2.toFixed(3),
//             CH4: emissionCH4.toFixed(6),
//             N2O: emissionN2O.toFixed(6),
//             CO2e: emissionCO2e.toFixed(3),
//             totalEnergyMJ: parseFloat(totalEnergyMJ.toFixed(2)),
//           }
//         };
//       }

//       // ✅ Check for duplicates before saving
//       const exists = await MobileCombustionEmissionModel.findOne({
//         userId,
//         vehicletype,
//         vehiclename,
//         fueltype,
//         fuelcombustion,
//         vehicledistance,
//       });

//       if (!exists) {
//         await MobileCombustionEmissionModel.create(recordData);
//       }

//       result.push(recordData);
//     }

//     return result;

//   } catch (err) {
//     console.error("calculateMobileCombustion error:", err.message);
//     return [];
//   }
// };

// module.exports = { calculateMobileCombustion };


const MonthlySubmission = require("../../models/submission/MonthlySubmissionModel");
const MobileCombustion = require("../../models/MobileCombustion");
const MobileCombustionEmissionModel = require("../../models/emissionCalculation/mobileCombustionEmissionModel");

const fuelDensitiesTon = {
  petrol: 0.00074,
  diesel: 0.00083,
  lpg: 0.00054,
  cng: 0.00042,
};

const calculateMonthlyMobileCombustion = async (userId) => {
  console.log("called mobile")
  const resultsByMonth = {};

  try {
    const submissions = await MonthlySubmission.find({ userId });
    for (const submission of submissions) {
      const { month, responses } = submission;
      const mobileData = responses.get("Scope1:DirectEmissions_MobileCombustion");

      if (!mobileData || !Array.isArray(mobileData)) continue;

      resultsByMonth[month] = [];

      for (const record of mobileData) {
        const totalvehicles = record["MobileCombustion_Q1"];
        const vehicletype = record["MobileCombustion_Q2"];
        const vehiclename = record["MobileCombustion_Q3"];
        const fueltypeRaw = record["MobileCombustion_Q4"] || "";
        const fueltype = fueltypeRaw.toLowerCase().trim().replace(/\.$/, "");
        const fuelcombustion = parseFloat(record["MobileCombustion_Q5"]) || 0;
        const vehicledistance = record["MobileCombustion_Q6"];

        const emissionData = await MobileCombustion.findOne({
          vehicleType: { $regex: new RegExp(vehicletype, "i") },
          fuelType: { $regex: new RegExp(fueltype, "i") },
        });

        let recordData;

        if (!emissionData) {
          recordData = {
            userId,
            month,
            totalvehicles,
            vehicletype,
            vehiclename,
            fueltype,
            fuelcombustion,
            vehicledistance,
            emission: {
              CO2: "Not Found",
              CH4: "Not Found",
              N2O: "Not Found",
              CO2e: "Not Found",
            },
          };
        } else if (fueltype === "cng") {
          const fuelTon = fuelcombustion * 0.001;
          recordData = {
            userId,
            month,
            totalvehicles,
            vehicletype,
            vehiclename,
            fueltype,
            fuelcombustion,
            vehicledistance,
            emission: {
              CO2: (fuelTon * emissionData.CO2).toFixed(3),
              CH4: (fuelTon * emissionData.CH4).toFixed(6),
              N2O: (fuelTon * emissionData.N2O).toFixed(6),
              CO2e: (fuelTon * emissionData.CO2e).toFixed(3),
              totalEnergyMJ: (fuelcombustion * emissionData.NCV).toFixed(2),
            },
          };
        } else {
          const densityTon = fuelDensitiesTon[fueltype] || 0;
          const fuelcombustionKg = fuelcombustion * (densityTon * 1000);
          const totalEnergyMJ = fuelcombustionKg * parseFloat(emissionData.NCV || 0);

          recordData = {
            userId,
            month,
            totalvehicles,
            vehicletype,
            vehiclename,
            fueltype,
            fuelcombustion,
            vehicledistance,
            emission: {
              CO2: (fuelcombustion * emissionData.CO2 * densityTon).toFixed(3),
              CH4: (fuelcombustion * emissionData.CH4 * densityTon).toFixed(6),
              N2O: (fuelcombustion * emissionData.N2O * densityTon).toFixed(6),
              CO2e: (fuelcombustion * emissionData.CO2e * densityTon).toFixed(3),
              totalEnergyMJ: parseFloat(totalEnergyMJ.toFixed(2)),
            },
          };
        }

        // Optional: save to DB if not already saved
        const exists = await MobileCombustionEmissionModel.findOne({
          userId,
          month,
          vehicletype,
          vehiclename,
          fueltype,
          fuelcombustion,
          vehicledistance,
        });

        if (!exists) {
          await MobileCombustionEmissionModel.create(recordData);
        }

        resultsByMonth[month].push(recordData);
      }
    }

    return resultsByMonth;
  } catch (err) {
    console.error("calculateMonthlyMobileCombustion error:", err.message);
    return {};
  }
};

module.exports = { calculateMonthlyMobileCombustion };
