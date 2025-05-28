
const StationaryCombustionEmission = require("../../models/emissionCalculation/stationaryCombustionEmissionModel");

const calculateStationaryCombustionEmission = async (req, res) => {
  try {
    const { userId } = req.params;

    const emissions = await StationaryCombustionEmission.find({ userId });

    if (!emissions || emissions.length === 0) {
      return res.status(404).json({
        message: "No Stationary Combustion Emission data found for this user."
      });
    }

    const formattedData = emissions.map((item) => ({
      userId: item.userId,
      month:item.month,
      fuelType: item.fuelType,
      fuelUnit: item.fuelUnit,
      annualFuelConsumption: item.annualFuelConsumption,
      emissionFactorCO2: item.emissionFactorCO2,
      emissionFactorCH4: item.emissionFactorCH4,
      emissionFactorN2O: item.emissionFactorN2O,
      emissionFactorSF6: item.emissionFactorSF6,
      emissionFactorCO2e: item.emissionFactorCO2e,
      emission: {
        totalCO2: item.emission?.totalCO2 || 0,
        totalCH4: item.emission?.totalCH4 || 0,
        totalN2O: item.emission?.totalN2O || 0,
        totalSF6: item.emission?.totalSF6 || 0,
        totalCO2e: item.emission?.totalCO2e || 0
      }
    }));

    return res.status(200).json({
      message: "Stationary Combustion Emission data fetched successfully",
      data: formattedData
    });

  } catch (error) {
    console.error("Error fetching stationary combustion emission:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message
    });
  }
};

module.exports = {
  calculateStationaryCombustionEmission
};
