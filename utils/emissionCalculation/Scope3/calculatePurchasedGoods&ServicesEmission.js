// // controllers/scope3/calculatePurchasedGoodsServicesEmission.js
// const Submission = require("../../../models/Submission");
// const PurchasedGoodsServicesModel = require("../../../models/emissionCalculation/PurchasedGoodsServicesModel");
// const EmissionFactorData = require("../../../models/PurchasedGoodServices"); // Emission factor model

// const calculatePurchasedGoodsServicesEmission = async (userId) => {
//   try {
//     const submission = await Submission.findOne({ userId }).lean();

//     if (!submission || !submission.responses || !submission.responses["Scope3:ValueChainEmissions_PurchasedGoodsServices"]) {
//       throw new Error("Purchased Goods & Services data not found in submission");
//     }

//     const goodsDataArray = submission.responses["Scope3:ValueChainEmissions_PurchasedGoodsServices"];

//     for (const goods of goodsDataArray) {
//       const material = goods?.PurchasedGoodsServices_Q1?.trim();
//       const quantityUnit = goods?.PurchasedGoodsServices_Q2?.trim(); // new dropdown field for unit: 'Kg' or 'Unit'
//       const rawQuantity = goods?.PurchasedGoodsServices_Q3?.toString().replace(/[^\d.]/g, '') || "0";
//       const quantity = parseFloat(rawQuantity);

//       // Fetch emission factor from DB
//       const factorData = await EmissionFactorData.findOne({ productService: new RegExp(`^${material}$`, 'i') }).lean();
//       if (!factorData || !factorData.CO2 || !factorData.CH4 || !factorData.N2O || !factorData.CO2e) {
//         console.warn(`Emission factor not found for material: ${material}`);
//         continue;
//       }

//       // Adjust quantity if emission factor unit is kg/T
//       let adjustedQuantity = quantity;
//       if (factorData.unit === "kg/T" && quantityUnit === "Kg") {
//         adjustedQuantity = quantity / 1000; // convert kg to ton
//       }

//       const emissionCO2 = adjustedQuantity * parseFloat(factorData.CO2);
//       const emissionCH4 = adjustedQuantity * parseFloat(factorData.CH4);
//       const emissionN2O = adjustedQuantity * parseFloat(factorData.N2O);
//       const emissionCO2e = adjustedQuantity * parseFloat(factorData.CO2e);

//       const duplicate = await PurchasedGoodsServicesModel.findOne({
//         userId,
//         material,
//         quantity,
//         quantityUnit
//       }).lean();

//       if (!duplicate) {
//         const newRecord = new PurchasedGoodsServicesModel({
//           userId,
//           material,
//           quantity,
//           quantityUnit,
//           emissionFactorCO2: parseFloat(factorData.CO2),
//           emissionFactorCH4: parseFloat(factorData.CH4),
//           emissionFactorN2O: parseFloat(factorData.N2O),
//           emissionFactorCO2e: parseFloat(factorData.CO2e),
//           emissionCO2,
//           emissionCH4,
//           emissionN2O,
//           emissionCO2e
//         });
//         await newRecord.save();
//       }
//     }

//   } catch (err) {
//     console.error("Purchased Goods & Services Emission Calculation Error:", err.message);
//   }
// };

// module.exports = { calculatePurchasedGoodsServicesEmission };


const MonthlySubmission = require("../../../models/submission/MonthlySubmissionModel");
const PurchasedGoodsServicesModel = require("../../../models/emissionCalculation/PurchasedGoodsServicesModel");
const EmissionFactorData = require("../../../models/PurchasedGoodServices"); // Emission factor model

const calculateMonthlyPurchasedGoodsServices = async (userId) => {
  try {
    const submissions = await MonthlySubmission.find({ userId });

    if (!submissions.length) {
      return { success: false, message: "No monthly submissions found." };
    }

    const results = [];

    for (const submission of submissions) {
      const { month, responses } = submission;
      const goodsDataArray = responses?.get("Scope3:ValueChainEmissions_PurchasedGoodsServices");

      if (!Array.isArray(goodsDataArray) || goodsDataArray.length === 0) continue;

      for (const goods of goodsDataArray) {
        const material = goods?.PurchasedGoodsServices_Q1?.trim();
        const quantityUnit = goods?.PurchasedGoodsServices_Q3?.trim();
        const rawQuantity = goods?.PurchasedGoodsServices_Q2?.toString().replace(/[^\d.]/g, '') || "0";
        const quantity = parseFloat(rawQuantity);

        if (!material || isNaN(quantity) || quantity <= 0) continue;

        const factorData = await EmissionFactorData.findOne({
          productService: new RegExp(`^${material}$`, "i")
        }).lean();

        if (!factorData || !factorData.CO2 || !factorData.CH4 || !factorData.N2O || !factorData.CO2e) {
          console.warn(`Emission factor not found for material: ${material}`);
          continue;
        }

        let adjustedQuantity = quantity;
        if (factorData.unit === "kg/T" && quantityUnit === "Kg") {
          adjustedQuantity = quantity / 1000; // convert kg to ton
        }

        const emissionCO2 = adjustedQuantity * parseFloat(factorData.CO2);
        const emissionCH4 = adjustedQuantity * parseFloat(factorData.CH4);
        const emissionN2O = adjustedQuantity * parseFloat(factorData.N2O);
        const emissionCO2e = adjustedQuantity * parseFloat(factorData.CO2e);

        const exists = await PurchasedGoodsServicesModel.findOne({
          userId,
          month,
          material,
          quantity,
          quantityUnit
        });

        if (!exists) {
          await PurchasedGoodsServicesModel.create({
            userId,
            month,
            material,
            quantity,
            quantityUnit,
            emissionFactorCO2: parseFloat(factorData.CO2),
            emissionFactorCH4: parseFloat(factorData.CH4),
            emissionFactorN2O: parseFloat(factorData.N2O),
            emissionFactorCO2e: parseFloat(factorData.CO2e),
            emissionCO2,
            emissionCH4,
            emissionN2O,
            emissionCO2e
          });
        }

        results.push({
          month,
          material,
          quantity,
          quantityUnit,
          CO2: emissionCO2.toFixed(3),
          CH4: emissionCH4.toFixed(6),
          N2O: emissionN2O.toFixed(6),
          CO2e: emissionCO2e.toFixed(3)
        });
      }
    }

    return {
      success: true,
      data: results
    };
  } catch (err) {
    console.error("calculateMonthlyPurchasedGoodsServices error:", err.message);
    return {
      success: false,
      message: err.message
    };
  }
};

module.exports = { calculateMonthlyPurchasedGoodsServices };

