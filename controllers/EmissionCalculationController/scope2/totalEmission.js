// // controllers/scope2/totalEmission.js

// const PurchasedElectricityModel = require("../../../models/emissionCalculation/PurchasedElectricityModel");
// const PurchasedSteamHeatCoolingModel = require("../../../models/emissionCalculation/PurchasedSteamHeatCoolingModel");

// const getTotalScope2Emission = async (req, res) => {
//   try {
//     const { userId } = req.params;

//     if (!userId) {
//       return res.status(400).json({ success: false, message: "User ID is required" });
//     }

//     const electricityEmissions = await PurchasedElectricityModel.find({ userId }).lean();
//     const steamEmissions = await PurchasedSteamHeatCoolingModel.find({ userId }).lean();

//     const totalElectricityEmission = electricityEmissions.reduce((acc, item) => acc + (item.emissionKgCO2e || 0), 0);
//     const totalSteamEmission = steamEmissions.reduce((acc, item) => acc + (item.totalEmission || 0), 0);
//     const totalScope2Emission = totalElectricityEmission + totalSteamEmission;

//     res.status(200).json({
//       success: true,
//       data: {
//         totalElectricityEmission: totalElectricityEmission.toFixed(2),
//         totalSteamEmission: totalSteamEmission.toFixed(2),
//         totalScope2Emission: totalScope2Emission.toFixed(2)
//       }
//     });
//   } catch (err) {
//     console.error("Total Scope 2 Emission Error:", err.message);
//     res.status(500).json({ success: false, message: "Server error", error: err.message });
//   }
// };

// module.exports = { getTotalScope2Emission };



// controllers/scope2/totalEmission.js

const PurchasedElectricityModel = require("../../../models/emissionCalculation/PurchasedElectricityModel");
const PurchasedSteamHeatCoolingModel = require("../../../models/emissionCalculation/PurchasedSteamHeatCoolingModel");

const getTotalScope2Emission = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    const electricityEmissions = await PurchasedElectricityModel.find({ userId }).lean();
    const steamEmissions = await PurchasedSteamHeatCoolingModel.find({ userId }).lean();

    const monthlyEmissions = {};

    const accumulate = (records, getMonth, getCO2e) => {
      for (const record of records) {
        const month = getMonth(record);
        const value = parseFloat(getCO2e(record) || 0);
        if (!monthlyEmissions[month]) monthlyEmissions[month] = 0;
        monthlyEmissions[month] += value;
      }
    };

    // Aggregate by month
    accumulate(electricityEmissions, r => r.month, r => r.emissionKgCO2e);
    accumulate(steamEmissions, r => r.month, r => r.totalEmission);

    // Format with 2 decimals
    const formattedMonthly = {};
    Object.entries(monthlyEmissions).forEach(([month, value]) => {
      formattedMonthly[month] = parseFloat(value.toFixed(2));
    });

    res.status(200).json({
      success: true,
      message: "Monthly Scope 2 CO2e emissions calculated successfully",
      monthlyScope2Emissions: formattedMonthly
    });
  } catch (err) {
    console.error("Total Scope 2 Emission Error:", err.message);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

module.exports = { getTotalScope2Emission };
