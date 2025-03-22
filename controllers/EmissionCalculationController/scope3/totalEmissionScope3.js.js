const PurchasedGoodsServicesModel = require("../../../models/emissionCalculation/PurchasedGoodsServicesModel");
const UseSoldProductEmission = require("../../../models/emissionCalculation/UseSoldProductEmissionModel");
const EndOfLifeTreatmentModel = require("../../../models/emissionCalculation/EndOfLifeTreatmentModel");

const calculateTotalScope3Emissions = async (req, res) => {
  try {
    const { userId } = req.params;

    const total = {
      CO2: 0,
      CH4: 0,
      N2O: 0,
      CO2e: 0
    };

    // --- PURCHASED GOODS & SERVICES ---
    const purchasedGoods = await PurchasedGoodsServicesModel.find({ userId });
    purchasedGoods.forEach(item => {
      total.CO2 += parseFloat(item.emissionCO2 || 0);
      total.CH4 += parseFloat(item.emissionCH4 || 0);
      total.N2O += parseFloat(item.emissionN2O || 0);
      total.CO2e += parseFloat(item.emissionCO2e || 0);
    });

    // --- USE OF SOLD PRODUCTS ---
    const useSoldProducts = await UseSoldProductEmission.find({ userId });
    useSoldProducts.forEach(item => {
      total.CO2 += parseFloat(item.CO2 || 0);
      total.CH4 += parseFloat(item.CH4 || 0);
      total.N2O += parseFloat(item.N2O || 0);
      total.CO2e += parseFloat(item.CO2e || 0);
    });

    // --- END-OF-LIFE TREATMENT ---
    const endOfLife = await EndOfLifeTreatmentModel.find({ userId });
    endOfLife.forEach(item => {
      total.CO2 += parseFloat(item.CO2 || 0);
      total.CH4 += parseFloat(item.CH4 || 0);
      total.N2O += parseFloat(item.N2O || 0);
      total.CO2e += parseFloat(item.CO2e || 0);
    });

    return res.status(200).json({
      message: "Total Scope 3 emissions calculated successfully",
      totalScope3Emissions: {
        CO2: parseFloat(total.CO2.toFixed(3)),
        CH4: parseFloat(total.CH4.toFixed(6)),
        N2O: parseFloat(total.N2O.toFixed(6)),
        CO2e: parseFloat(total.CO2e.toFixed(3))
      }
    });

  } catch (error) {
    console.error("Error calculating total Scope 3 emissions:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

module.exports = {
  calculateTotalScope3Emissions
};