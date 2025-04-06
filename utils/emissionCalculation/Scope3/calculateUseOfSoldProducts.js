// const Submission = require("../../../models/Submission");
// const UseSoldProductEmissionModel = require("../../../models/emissionCalculation/UseSoldProductEmissionModel");
// const EmissionFactor = require("../../../models/contryEmissionFactorModel");
// const UseSoldProductFactor = require("../../../models/useSoldProducts");

// const calculateUseOfSoldProducts = async (userId) => {
//   try {
//     console.log("called")
//     const submission = await Submission.findOne({ userId }).lean();

//     if (!submission || !submission.responses || !submission.responses["Scope3:ValueChainEmissions_UseofSoldProducts"]) {
//       throw new Error("Use of Sold Products data not found");
//     }

//     const useSoldProductArray = submission.responses["Scope3:ValueChainEmissions_UseofSoldProducts"];
//     const countryEF = await EmissionFactor.findOne().sort({ createdAt: -1 }).lean();
//     const energyEmissionFactor = parseFloat(countryEF?.emissionFactor || 0.971); // kg CO2/kWh

//     const results = [];

//     for (const data of useSoldProductArray) {
//       const productName = data?.["UseofSoldProducts_Q1"];
//       const unitsSold = parseInt(data?.["UseofSoldProducts_Q2"] || 0);
//       const requiresEnergy = data?.["UseofSoldProducts_Q3"] === true || data?.["UseofSoldProducts_Q3"]?.toLowerCase() === "yes";
//       const energyUsePerYear = parseFloat(data?.["UseofSoldProducts_Q4"] || 0);
//       const lifetimeYears = parseFloat(data?.["UseofSoldProducts_Q5"] || 0);


//       // Skip if unitsSold is not valid
//       if (!productName || !unitsSold || isNaN(unitsSold) || unitsSold <= 0) continue;

//       const productFactor = await UseSoldProductFactor.findOne({ productService: productName }).lean();

//       let CO2 = 0, CH4 = 0, N2O = 0, CO2e = 0;

//       // CASE A: Factor-based emission
//       if (productFactor) {
//         CO2 = productFactor.CO2 * unitsSold;
//         CH4 = productFactor.CH4 * unitsSold;
//         N2O = productFactor.N2O * unitsSold;
//         CO2e = productFactor.CO2e * unitsSold;
//       }

//       // CASE B: If energy required
//       if (requiresEnergy && energyUsePerYear > 0 && lifetimeYears > 0) {
//         const totalEnergy = unitsSold * energyUsePerYear * lifetimeYears;
//         const additionalCO2 = totalEnergy * energyEmissionFactor;
//         CO2 += additionalCO2;
//         CO2e += additionalCO2;
//       }

//       const duplicate = await UseSoldProductEmissionModel.findOne({
//         userId,
//         productName,
//         unitsSold,
//         CO2,
//         CH4,
//         N2O,
//         CO2e
//       }).lean();

//       if (!duplicate) {
//         const record = new UseSoldProductEmissionModel({
//           userId,
//           productName,
//           unitsSold,
//           requiresEnergy,
//           energyUsePerYear,
//           lifetimeYears,
//           CO2,
//           CH4,
//           N2O,
//           CO2e
//         });
//         await record.save();

//       }

//       results.push({ productName, unitsSold, CO2, CH4, N2O, CO2e });
//     }

//     return {
//       success: true,
//       data: results
//     };

//   } catch (err) {
//     console.error("Use of Sold Products Emission Error:", err.message);
//     return { success: false, message: err.message };
//   }
// };

// module.exports = { calculateUseOfSoldProducts };



const MonthlySubmission = require("../../../models/submission/MonthlySubmissionModel");
const UseSoldProductEmissionModel = require("../../../models/emissionCalculation/UseSoldProductEmissionModel");
const EmissionFactor = require("../../../models/contryEmissionFactorModel");
const UseSoldProductFactor = require("../../../models/useSoldProducts");

const calculateMonthlyUseOfSoldProducts = async (userId) => {
  try {
    const submissions = await MonthlySubmission.find({ userId });

    if (!submissions.length) {
      return { success: false, message: "No monthly submissions found." };
    }

    const countryEF = await EmissionFactor.findOne().sort({ createdAt: -1 }).lean();
    const energyEmissionFactor = parseFloat(countryEF?.emissionFactor || 0.971); // kg CO2/kWh

    const results = [];

    for (const sub of submissions) {
      const { month, responses } = sub;
      const useSoldProductArray = responses?.get("Scope3:ValueChainEmissions_UseofSoldProducts");

      if (!Array.isArray(useSoldProductArray) || useSoldProductArray.length === 0) continue;

      for (const data of useSoldProductArray) {
        const productName = data?.["UseofSoldProducts_Q1"];
        const unitsSold = parseInt(data?.["UseofSoldProducts_Q2"] || 0);
        const requiresEnergy =
          data?.["UseofSoldProducts_Q7"] === true ||
          data?.["UseofSoldProducts_Q7"]?.toLowerCase() === "yes";
        const energyUsePerYear = parseFloat(data?.["UseofSoldProducts_Q8"] || 0);
        const lifetimeYears = parseFloat(data?.["UseofSoldProducts_Q6"] || 0);

        if (!productName || isNaN(unitsSold) || unitsSold <= 0) continue;

        const productFactor = await UseSoldProductFactor.findOne({ productService: productName }).lean();

        let CO2 = 0,
          CH4 = 0,
          N2O = 0,
          CO2e = 0;

        // A. Static factor emissions
        if (productFactor) {
          CO2 = productFactor.CO2 * unitsSold;
          CH4 = productFactor.CH4 * unitsSold;
          N2O = productFactor.N2O * unitsSold;
          CO2e = productFactor.CO2e * unitsSold;
        }

        // B. Dynamic energy-based emissions
        if (requiresEnergy && energyUsePerYear > 0 && lifetimeYears > 0) {
          const totalEnergy = unitsSold * energyUsePerYear * lifetimeYears;
          const additionalCO2 = totalEnergy * energyEmissionFactor;
          CO2 += additionalCO2;
          CO2e += additionalCO2;
        }

        const exists = await UseSoldProductEmissionModel.findOne({
          userId,
          month,
          productName,
          unitsSold,
          CO2,
          CH4,
          N2O,
          CO2e
        });

        if (!exists) {
          await UseSoldProductEmissionModel.create({
            userId,
            month,
            productName,
            unitsSold,
            requiresEnergy,
            energyUsePerYear,
            lifetimeYears,
            CO2,
            CH4,
            N2O,
            CO2e
          });
        }

        results.push({
          month,
          productName,
          unitsSold,
          requiresEnergy,
          CO2,
          CH4,
          N2O,
          CO2e
        });
      }
    }

    return {
      success: true,
      data: results
    };
  } catch (err) {
    console.error("calculateMonthlyUseOfSoldProducts error:", err.message);
    return {
      success: false,
      message: err.message
    };
  }
};

module.exports = { calculateMonthlyUseOfSoldProducts };
