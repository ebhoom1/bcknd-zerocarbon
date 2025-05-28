
const FugitiveEmissionCalculation = require("../../models/emissionCalculation/fugitiveEmissionModel");

const calculateFugitiveEmissions = async (req, res) => {
  try {
    const { userId } = req.params;

    const emissions = await FugitiveEmissionCalculation.find({ userId });

    if (!emissions || emissions.length === 0) {
      return res.status(404).json({
        message: "No Fugitive Emission data found for this user."
      });
    }

    const formattedData = emissions.map((item) => ({
      userId: item.userId,
      month:item.month,
      category: item.category || "",
      gasType: item.gasType || "",
      emissionSource: item.emissionSource || "",
      quantity: item.quantity || 0,
      emission: {
        CO2: item.emission?.CO2 || 0,
        CH4: item.emission?.CH4 || 0,
        N2O: item.emission?.N2O || 0,
        SF6: item.emission?.SF6 || 0,
        CO2e: item.emission?.CO2e || 0
      }
    }));

    return res.status(200).json({
      message: "Fugitive Emission data fetched successfully",
      data: formattedData
    });

  } catch (error) {
    console.error("Error fetching fugitive emission data:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message
    });
  }
};

module.exports = {
  calculateFugitiveEmissions
};
