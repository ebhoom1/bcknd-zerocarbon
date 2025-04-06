

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


