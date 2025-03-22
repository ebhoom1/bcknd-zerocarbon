const MobileCombustionEmission = require("../../models/emissionCalculation/mobileCombustionEmissionModel");
const StationaryCombustionEmission = require("../../models/emissionCalculation/stationaryCombustionEmissionModel");
const IndustrialProcessesEmission = require("../../models/emissionCalculation/industrialProcessesEmissionModel");
const FugitiveEmissionCalculation = require("../../models/emissionCalculation/fugitiveEmissionModel");

const calculateTotalEmissions = async (req, res) => {
  try {
    const { userId } = req.params;

    const total = {
      CO2: 0,
      CH4: 0,
      N2O: 0,
      CO2e: 0,
      SF6: 0,
      NCV: 0
    };

    // --- MOBILE COMBUSTION ---
    const mobileEmissions = await MobileCombustionEmission.find({ userId });
    mobileEmissions.forEach((item) => {
      total.CO2 += parseFloat(item.emission?.CO2 || 0);
      total.CH4 += parseFloat(item.emission?.CH4 || 0);
      total.N2O += parseFloat(item.emission?.N2O || 0);
      total.CO2e += parseFloat(item.emission?.CO2e || 0);
      total.NCV += parseFloat(item.emission?.totalEnergyMJ || 0);
    });

    // --- STATIONARY COMBUSTION ---
    const stationaryEmissions = await StationaryCombustionEmission.find({ userId });
    stationaryEmissions.forEach((item) => {
      total.CO2 += parseFloat(item.emission?.totalCO2 || 0);
      total.CH4 += parseFloat(item.emission?.totalCH4 || 0);
      total.N2O += parseFloat(item.emission?.totalN2O || 0);
      total.CO2e += parseFloat(item.emission?.totalCO2e || 0);
      total.SF6 += parseFloat(item.emission?.totalSF6 || 0);
    });

    // --- INDUSTRIAL PROCESSES ---
    const industrialEmissions = await IndustrialProcessesEmission.find({ userId });
    industrialEmissions.forEach((item) => {
      total.CO2 += parseFloat(item.emission?.CO2 || 0);
      total.CH4 += parseFloat(item.emission?.CH4 || 0);
      total.N2O += parseFloat(item.emission?.N2O || 0);
      total.CO2e += parseFloat(item.emission?.CO2e || 0);
    });

    // --- FUGITIVE EMISSIONS ---
    const fugitiveEmissions = await FugitiveEmissionCalculation.find({ userId });
    fugitiveEmissions.forEach((item) => {
      total.CO2 += parseFloat(item.emission?.CO2 || 0);
      total.CH4 += parseFloat(item.emission?.CH4 || 0);
      total.N2O += parseFloat(item.emission?.N2O || 0);
      total.CO2e += parseFloat(item.emission?.CO2e || 0);
      total.SF6 += parseFloat(item.emission?.SF6 || 0);
    });

    return res.status(200).json({
      message: "Total emissions calculated successfully",
      totalEmissions: {
        CO2: parseFloat(total.CO2.toFixed(3)),
        CH4: parseFloat(total.CH4.toFixed(6)),
        N2O: parseFloat(total.N2O.toFixed(6)),
        CO2e: parseFloat(total.CO2e.toFixed(3)),
        SF6: parseFloat(total.SF6.toFixed(6)),
       NCV: parseFloat(total.NCV.toFixed(2))

      }
    });

  } catch (error) {
    console.error("Error calculating total emissions:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

module.exports = {
  calculateTotalEmissions
};
