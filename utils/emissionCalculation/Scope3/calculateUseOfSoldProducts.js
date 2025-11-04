


// const MonthlySubmission = require("../../../models/submission/MonthlySubmissionModel");
// const UseSoldProductEmissionModel = require("../../../models/emissionCalculation/UseSoldProductEmissionModel");
// const EmissionFactor = require("../../../models/contryEmissionFactorModel");
// const UseSoldProductFactor = require("../../../models/useSoldProducts");

// const calculateMonthlyUseOfSoldProducts = async (userId) => {
//   try {
//     const submissions = await MonthlySubmission.find({ userId });

//     if (!submissions.length) {
//       return { success: false, message: "No monthly submissions found." };
//     }

//     const countryEF = await EmissionFactor.findOne().sort({ createdAt: -1 }).lean();
//     const energyEmissionFactor = parseFloat(countryEF?.emissionFactor || 0.971); // kg CO2/kWh

//     const results = [];

//     for (const sub of submissions) {
//       const { month, responses } = sub;
//       const useSoldProductArray = responses?.get("Scope3:ValueChainEmissions_UseofSoldProducts");

//       if (!Array.isArray(useSoldProductArray) || useSoldProductArray.length === 0) continue;

//       for (const data of useSoldProductArray) {
//         const productName = data?.["UseofSoldProducts_Q1"];
//         const unitsSold = parseInt(data?.["UseofSoldProducts_Q2"] || 0);
//         const requiresEnergy =
//           data?.["UseofSoldProducts_Q7"] === true ||
//           data?.["UseofSoldProducts_Q7"]?.toLowerCase() === "yes";
//         const energyUsePerYear = parseFloat(data?.["UseofSoldProducts_Q8"] || 0);
//         const lifetimeYears = parseFloat(data?.["UseofSoldProducts_Q6"] || 0);

//         if (!productName || isNaN(unitsSold) || unitsSold <= 0) continue;

//         const productFactor = await UseSoldProductFactor.findOne({ productService: productName }).lean();

//         let CO2 = 0,
//           CH4 = 0,
//           N2O = 0,
//           CO2e = 0;

//         // A. Static factor emissions
//         if (productFactor) {
//           CO2 = productFactor.CO2 * unitsSold;
//           CH4 = productFactor.CH4 * unitsSold;
//           N2O = productFactor.N2O * unitsSold;
//           CO2e = productFactor.CO2e * unitsSold;
//         }

//         // B. Dynamic energy-based emissions
//         if (requiresEnergy && energyUsePerYear > 0 && lifetimeYears > 0) {
//           const totalEnergy = unitsSold * energyUsePerYear * lifetimeYears;
//           const additionalCO2 = totalEnergy * energyEmissionFactor;
//           CO2 += additionalCO2;
//           CO2e += additionalCO2;
//         }

//         const exists = await UseSoldProductEmissionModel.findOne({
//           userId,
//           month,
//           productName,
//           unitsSold,
//           CO2,
//           CH4,
//           N2O,
//           CO2e
//         });

//         if (!exists) {
//           await UseSoldProductEmissionModel.create({
//             userId,
//             month,
//             productName,
//             unitsSold,
//             requiresEnergy,
//             energyUsePerYear,
//             lifetimeYears,
//             CO2,
//             CH4,
//             N2O,
//             CO2e
//           });
//         }

//         results.push({
//           month,
//           productName,
//           unitsSold,
//           requiresEnergy,
//           CO2,
//           CH4,
//           N2O,
//           CO2e
//         });
//       }
//     }

//     return {
//       success: true,
//       data: results
//     };
//   } catch (err) {
//     console.error("calculateMonthlyUseOfSoldProducts error:", err.message);
//     return {
//       success: false,
//       message: err.message
//     };
//   }
// };

// module.exports = { calculateMonthlyUseOfSoldProducts };


const MonthlySubmission = require("../../../models/submission/MonthlySubmissionModel");
const UseSoldProductEmissionModel = require("../../../models/emissionCalculation/UseSoldProductEmissionModel");
const EmissionFactor = require("../../../models/contryEmissionFactorModel");
const UseSoldProductFactor = require("../../../models/useSoldProducts");

const getResponseBlock = (responses, key) =>
  typeof responses?.get === "function" ? responses.get(key) : responses?.[key];

const toNumber = (v, def = 0) => {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string") {
    const t = v.trim().toLowerCase();
    // common phrase: "Consumed within 1 year"
    if (t.includes("within 1 year")) return 1;
    const m = t.match(/-?\d+(\.\d+)?/);
    if (m) return parseFloat(m[0]);
  }
  return def;
};

const isYes = (v) => (typeof v === "boolean" ? v : String(v || "").trim().toLowerCase() === "yes");

/**
 * Optional: add `month` to only recompute that month.
 * Usage from controller: await calculateMonthlyUseOfSoldProducts(userId, month)
 */
const calculateMonthlyUseOfSoldProducts = async (userId, month = null) => {
  try {
    const subQuery = month ? { userId, month } : { userId };
    const submissions = await MonthlySubmission.find(subQuery);

    if (!submissions.length) {
      return { success: false, message: "No monthly submissions found." };
    }

    // Grid EF (kg CO2/kWh). Fall back if missing.
    const countryEF = await EmissionFactor.findOne().sort({ createdAt: -1 }).lean();
    const energyEmissionFactor = toNumber(countryEF?.emissionFactor, 0.971);

    const results = [];

    for (const sub of submissions) {
      const { month: subMonth, responses } = sub;
      const key = "Scope3:ValueChainEmissions_UseofSoldProducts";
      const useSoldProductArray = getResponseBlock(responses, key);

      if (!Array.isArray(useSoldProductArray) || useSoldProductArray.length === 0) continue;

      for (const data of useSoldProductArray) {
        const productName = data?.["UseofSoldProducts_Q1"]?.trim();
        const unitsSold = toNumber(data?.["UseofSoldProducts_Q2"], 0);
        const requiresEnergy = isYes(data?.["UseofSoldProducts_Q7"]);

        // Only parse these if energy is required
        const energyUsePerYear = requiresEnergy ? toNumber(data?.["UseofSoldProducts_Q8"], 0) : 0;
        const lifetimeYears   = requiresEnergy ? toNumber(data?.["UseofSoldProducts_Q6"], 1) : 0;

        if (!productName || unitsSold <= 0) continue;

        // product factor (case-insensitive match)
        const productFactor = await UseSoldProductFactor.findOne({
          productService: new RegExp(`^${productName}$`, "i"),
        }).lean();

        let CO2 = 0, CH4 = 0, N2O = 0, CO2e = 0;

        // A) Static factor emissions per unit
        if (productFactor) {
          CO2 += toNumber(productFactor.CO2, 0)  * unitsSold;
          CH4 += toNumber(productFactor.CH4, 0)  * unitsSold;
          N2O += toNumber(productFactor.N2O, 0)  * unitsSold;
          CO2e += toNumber(productFactor.CO2e, 0) * unitsSold;
        }

        // B) Dynamic energy-based emissions (avoid NaN with our guards)
        if (requiresEnergy && energyUsePerYear > 0 && lifetimeYears > 0) {
          const totalEnergy = unitsSold * energyUsePerYear * lifetimeYears; // kWh
          const additionalCO2 = totalEnergy * energyEmissionFactor;        // kg CO2
          CO2  += additionalCO2;
          CO2e += additionalCO2; // if EF is CO2-only; if you have CO2e per kWh, use that instead
        }

        // Upsert by (userId, month, productName)
        await UseSoldProductEmissionModel.updateOne(
          { userId, month: subMonth, productName },
          {
            $set: {
              userId,
              month: subMonth,
              productName,
              unitsSold,
              requiresEnergy,
              energyUsePerYear,
              lifetimeYears,
              CO2,
              CH4,
              N2O,
              CO2e,
            },
          },
          { upsert: true }
        );

        results.push({
          month: subMonth,
          productName,
          unitsSold,
          requiresEnergy,
          energyUsePerYear,
          lifetimeYears,
          CO2,
          CH4,
          N2O,
          CO2e,
        });
      }
    }

    return { success: true, data: results };
  } catch (err) {
    console.error("calculateMonthlyUseOfSoldProducts error:", err);
    return { success: false, message: err.message };
  }
};

module.exports = { calculateMonthlyUseOfSoldProducts };
