
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

// const getMobileCombustionEmissionData = async (req, res) => {
//   try {
//     const { userId } = req.params;

//     const submission = await Submission.findOne({ userId });

//     if (!submission || !submission.responses || !submission.responses.get("Scope1:DirectEmissions_MobileCombustion")) {
//       return res.status(404).json({
//         message: "No Mobile Combustion data found for this user.",
//       });
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

//         // ✅ Check duplicate before saving
//         const alreadyExists = await MobileCombustionEmissionModel.findOne({
//           userId,
//           vehicletype,
//           vehiclename,
//           fueltype,
//           fuelcombustion,
//           vehicledistance,
//         });

//         if (!alreadyExists) {
//           await MobileCombustionEmissionModel.create(recordData);
//         }

//         result.push(recordData);
//         continue;
//       }

//       if (fueltype === "cng") {
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

//       // ✅ Check duplicate before saving
//       const alreadyExists = await MobileCombustionEmissionModel.findOne({
//         userId,
//         vehicletype,
//         vehiclename,
//         fueltype,
//         fuelcombustion,
//         vehicledistance,
//       });

//       if (!alreadyExists) {
//         await MobileCombustionEmissionModel.create(recordData);
//       }

//       result.push(recordData);
//     }

//     return res.status(200).json({
//       userId,
//       emissions: result,
//       message: "Calculated - saved only if not already exist"
//     });

//   } catch (error) {
//     console.error("Error in getMobileCombustionEmissionData:", error);
//     return res.status(500).json({
//       message: "Internal Server Error",
//       error: error.message
//     });
//   }
// };

// module.exports = { getMobileCombustionEmissionData };


const MobileCombustionEmission = require("../../models/emissionCalculation/mobileCombustionEmissionModel");

const getMobileCombustionEmissionData = async (req, res) => {
  try {
    const { userId } = req.params;

    const emissions = await MobileCombustionEmission.find({ userId });

    if (!emissions || emissions.length === 0) {
      return res.status(404).json({
        message: "No Mobile Combustion Emission data found for this user."
      });
    }

    const formattedData = emissions.map((item) => ({
      userId: item.userId,
      totalvehicles: item.totalvehicles,
      vehicletype: item.vehicletype,
      vehiclename: item.vehiclename,
      fueltype: item.fueltype,
      fuelcombustion: item.fuelcombustion,
      vehicledistance: item.vehicledistance,
      CO2: item.CO2,
      CH4: item.CH4,
      N2O: item.N2O,
      CO2e: item.CO2e,
      emission: {
        CO2: item.emission?.CO2 || "0",
        CH4: item.emission?.CH4 || "0",
        N2O: item.emission?.N2O || "0",
        CO2e: item.emission?.CO2e || "0",
        totalEnergyMJ: item.emission?.totalEnergyMJ || 0
      }
    }));

    return res.status(200).json({
      message: "Mobile Combustion Emission data fetched successfully",
      emissions: formattedData
    });

  } catch (error) {
    console.error("Error fetching mobile combustion emission:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message
    });
  }
};

module.exports = {
  getMobileCombustionEmissionData
};
