
const IndustrialProcessesEmission = require("../../models/emissionCalculation/industrialProcessesEmissionModel");

const calculateIndustrialProcessesEmission = async (req, res) => {
  try {
    const { userId } = req.params;

    const emissions = await IndustrialProcessesEmission.find({ userId });

    if (!emissions || emissions.length === 0) {
      return res.status(404).json({
        message: "No Industrial Processes Emission data found for this user."
      });
    }

    const formattedData = emissions.map((item) => ({
      userId: item.userId,
      month:item.month,
      industryType: item.industryType,
      emissionSource: item.emissionSource,
      unit: item.unit,
      productionQtyInKg: item.productionQtyInKg,
      normalizedQty: item.normalizedQty,
      emissionFactor: {
        CO2: item.emissionFactor?.CO2 || 0,
        CH4: item.emissionFactor?.CH4 || 0,
        N2O: item.emissionFactor?.N2O || 0,
        CO2e: item.emissionFactor?.CO2e || 0
      },
      emission: {
        CO2: item.emission?.CO2 || 0,
        CH4: item.emission?.CH4 || 0,
        N2O: item.emission?.N2O || 0,
        CO2e: item.emission?.CO2e || 0
      }
    }));

    return res.status(200).json({
      message: "Industrial Processes Emission data fetched successfully",
      data: formattedData
    });

  } catch (error) {
    console.error("Error fetching industrial processes emission:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message
    });
  }
};

module.exports = {
  calculateIndustrialProcessesEmission
};
