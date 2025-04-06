// // controllers/scope3/calculateEndOfLifeTreatment.js

// const Submission = require("../../../models/Submission");
// const EndOfLifeTreatmentFactor = require("../../../models/EndOfLifeTreatment");
// const EndOfLifeTreatmentModel = require("../../../models/emissionCalculation/EndOfLifeTreatmentModel");

// const calculateEndOfLifeTreatment = async (userId) => {
//   try {
//     const submission = await Submission.findOne({ userId }).sort({ submittedAt: -1 }).lean();

//     if (!submission || !submission.responses || !submission.responses["Scope3:ValueChainEmissions_End-of-LifeTreatmentofSoldProducts"]) {
//       throw new Error("End of Life Treatment data not found in submission");
//     }

//     const data = submission.responses["Scope3:ValueChainEmissions_End-of-LifeTreatmentofSoldProducts"];
//     const totalResults = [];

//     for (let i = 0; i < data.length; i++) {
//       const entry = data[i];
//       const product = entry["End-of-LifeTreatmentofSoldProducts_Q1"] || "";
//       const quantity = parseFloat(entry["End-of-LifeTreatmentofSoldProducts_Q2"] || 0);
//       const unit = entry["End-of-LifeTreatmentofSoldProducts_Q3"] || "kg";
//       const treatmentArray = entry["End-of-LifeTreatmentofSoldProducts_Q4"] || [];

//       for (let j = 0; j < treatmentArray.length; j++) {
//         const methodData = treatmentArray[j];
//         const method = methodData[`End-of-LifeTreatmentofSoldProducts_Q4_method_${j}_F1`] || "";
//         console.log("method:",method)
//         const percentage = parseFloat(methodData[`End-of-LifeTreatmentofSoldProducts_Q4_method_${j}_F2`] || 0);
//         console.log("percentage:",percentage)

//         const factor = await EndOfLifeTreatmentFactor.findOne({
//           productService: product,
//           endOfLifeTreatment: method,
//         }).lean();

//         if (!factor) continue;

//         // Unit Compatibility Logic
//         let quantityForCalculation = 0;

//         if (factor.unit === "kg/T") {
//           // Convert kg to tonnes, else assume user entered tonnes directly
//           quantityForCalculation = unit === "kg" ? quantity / 1000 : quantity;
//         } else if (factor.unit === "kg/unit") {
//           // For per-unit factors, no conversion required
//           quantityForCalculation = quantity;
//         } else {
//           // Fallback or unknown units — assume direct
//           quantityForCalculation = quantity;
//         }

//         // Optional Unit Mismatch Check (Uncomment if you want to strictly validate)
//         if ((unit === "units" && factor.unit === "kg/T") || (unit === "kg" && factor.unit === "kg/unit")) {
//           throw new Error(`Unit mismatch between submission (${unit}) and emission factor (${factor.unit})`);
//         }

//         const adjustedQuantity = quantityForCalculation * (percentage / 100);

//         const emissionCO2 = adjustedQuantity * parseFloat(factor.CO2 || 0);
//         const emissionCH4 = adjustedQuantity * parseFloat(factor.CH4 || 0);
//         const emissionN2O = adjustedQuantity * parseFloat(factor.N2O || 0);
//         const emissionCO2e = adjustedQuantity * parseFloat(factor.CO2e || 0);

//         const duplicate = await EndOfLifeTreatmentModel.findOne({
//           userId,
//           product,
//           method,
//           quantity: adjustedQuantity,
//           CO2: emissionCO2,
//           CH4: emissionCH4,
//           N2O: emissionN2O,
//           CO2e: emissionCO2e,
//         }).lean();

//         if (!duplicate) {
//           const treatment = new EndOfLifeTreatmentModel({
//             userId,
//             product,
//             method,
//             percentage,
//             quantity,
//             unit,
//             CO2: emissionCO2,
//             CH4: emissionCH4,
//             N2O: emissionN2O,
//             CO2e: emissionCO2e,
//             emissionFactor_CO2: parseFloat(factor.CO2 || 0),
//             emissionFactor_CH4: parseFloat(factor.CH4 || 0),
//             emissionFactor_N2O: parseFloat(factor.N2O || 0),
//             emissionFactor_CO2e: parseFloat(factor.CO2e || 0),
//             unitUsed: factor.unit
//           });
//           await treatment.save();
//         }

//         totalResults.push({
//           product,
//           method,
//           percentage,
//           quantity,
//           unit,
//           CO2: emissionCO2,
//           CH4: emissionCH4,
//           N2O: emissionN2O,
//           CO2e: emissionCO2e,
//           emissionFactor_CO2: parseFloat(factor.CO2 || 0),
//           emissionFactor_CH4: parseFloat(factor.CH4 || 0),
//           emissionFactor_N2O: parseFloat(factor.N2O || 0),
//           emissionFactor_CO2e: parseFloat(factor.CO2e || 0),
//           unitUsed: factor.unit,
//         });
//       }
//     }

//     return {
//       success: true,
//       data: totalResults,
//     };
//   } catch (error) {
//     console.error("End Of Life Treatment Calculation Error:", error.message);
//     return {
//       success: false,
//       message: error.message,
//     };
//   }
// };

// module.exports = { calculateEndOfLifeTreatment };


const MonthlySubmission = require("../../../models/submission/MonthlySubmissionModel");
const EndOfLifeTreatmentFactor = require("../../../models/EndOfLifeTreatment");
const EndOfLifeTreatmentModel = require("../../../models/emissionCalculation/EndOfLifeTreatmentModel");

const calculateMonthlyEndOfLifeTreatment = async (userId) => {
  console.log("called endlife")
  try {
    const submissions = await MonthlySubmission.find({ userId });

    if (!submissions.length) {
      return { success: false, message: "No monthly submissions found." };
    }

    const totalResults = [];

    for (const submission of submissions) {
      const month = submission.month;
      const data = submission.responses.get("Scope3:ValueChainEmissions_End-of-LifeTreatmentofSoldProducts");
      if (!Array.isArray(data) || !data.length) continue;

      for (let i = 0; i < data.length; i++) {
        const entry = data[i];
        const product = entry["End-of-LifeTreatmentofSoldProducts_Q1"] || "";
        const quantity = parseFloat(entry["End-of-LifeTreatmentofSoldProducts_Q2"] || 0);
        const unit = entry["End-of-LifeTreatmentofSoldProducts_Q3"] || "kg";
        const treatmentArray = entry["End-of-LifeTreatmentofSoldProducts_Q4"] || [];

        for (let j = 0; j < treatmentArray.length; j++) {
          const methodData = treatmentArray[j];
          const method = methodData[`End-of-LifeTreatmentofSoldProducts_Q4_method_${j}_F1`] || "";
          const percentage = parseFloat(methodData[`End-of-LifeTreatmentofSoldProducts_Q4_method_${j}_F2`] || 0);

          const factor = await EndOfLifeTreatmentFactor.findOne({
            productService: product,
            endOfLifeTreatment: method,
          }).lean();

          if (!factor) continue;

          // Normalize unit
          let quantityForCalculation = quantity;
          if (factor.unit === "kg/T" && unit === "kg") {
            quantityForCalculation = quantity / 1000;
          }

          const adjustedQuantity = quantityForCalculation * (percentage / 100);

          const emissionCO2 = adjustedQuantity * parseFloat(factor.CO2 || 0);
          const emissionCH4 = adjustedQuantity * parseFloat(factor.CH4 || 0);
          const emissionN2O = adjustedQuantity * parseFloat(factor.N2O || 0);
          const emissionCO2e = adjustedQuantity * parseFloat(factor.CO2e || 0);

          const duplicate = await EndOfLifeTreatmentModel.findOne({
            userId,
            month,
            product,
            method,
            quantity: adjustedQuantity,
            CO2: emissionCO2,
            CH4: emissionCH4,
            N2O: emissionN2O,
            CO2e: emissionCO2e,
          }).lean();

          if (!duplicate) {
            await EndOfLifeTreatmentModel.create({
              userId,
              month,
              product,
              method,
              percentage,
              quantity,
              unit,
              CO2: emissionCO2,
              CH4: emissionCH4,
              N2O: emissionN2O,
              CO2e: emissionCO2e,
              emissionFactor_CO2: parseFloat(factor.CO2 || 0),
              emissionFactor_CH4: parseFloat(factor.CH4 || 0),
              emissionFactor_N2O: parseFloat(factor.N2O || 0),
              emissionFactor_CO2e: parseFloat(factor.CO2e || 0),
              unitUsed: factor.unit,
            });
          }

          totalResults.push({
            month,
            product,
            method,
            percentage,
            quantity,
            unit,
            CO2: emissionCO2,
            CH4: emissionCH4,
            N2O: emissionN2O,
            CO2e: emissionCO2e,
            emissionFactor_CO2: parseFloat(factor.CO2 || 0),
            emissionFactor_CH4: parseFloat(factor.CH4 || 0),
            emissionFactor_N2O: parseFloat(factor.N2O || 0),
            emissionFactor_CO2e: parseFloat(factor.CO2e || 0),
            unitUsed: factor.unit,
          });
        }
      }
    }

    return {
      success: true,
      data: totalResults,
    };
  } catch (error) {
    console.error("Monthly End Of Life Treatment Calculation Error:", error.message);
    return {
      success: false,
      message: error.message,
    };
  }
};

module.exports = { calculateMonthlyEndOfLifeTreatment };
