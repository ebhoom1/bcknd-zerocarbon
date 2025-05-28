

const PurchasedGoodsServicesModel = require("../../../models/emissionCalculation/PurchasedGoodsServicesModel");
const UseSoldProductEmission = require("../../../models/emissionCalculation/UseSoldProductEmissionModel");
const EndOfLifeTreatmentModel = require("../../../models/emissionCalculation/EndOfLifeTreatmentModel");

const calculateTotalScope3Emissions = async (req, res) => {
  try {
    const { userId } = req.params;

    const monthlyCO2e = {};

    const accumulate = (records, getMonth, getCO2e) => {
      records.forEach(record => {
        const month = getMonth(record);
        const value = parseFloat(getCO2e(record) || 0);
        if (!monthlyCO2e[month]) monthlyCO2e[month] = 0;
        monthlyCO2e[month] += value;
      });
    };

    // PURCHASED GOODS & SERVICES
    const purchasedGoods = await PurchasedGoodsServicesModel.find({ userId });
    accumulate(purchasedGoods, r => r.month, r => r.emissionCO2e);

    // USE OF SOLD PRODUCTS
    const useSoldProducts = await UseSoldProductEmission.find({ userId });
    accumulate(useSoldProducts, r => r.month, r => r.CO2e);

    // END OF LIFE TREATMENT
    const endOfLife = await EndOfLifeTreatmentModel.find({ userId });
    accumulate(endOfLife, r => r.month, r => r.CO2e);

    // Format results
    const formattedMonthly = {};
    Object.entries(monthlyCO2e).forEach(([month, value]) => {
      formattedMonthly[month] = parseFloat(value.toFixed(3));
    });

    return res.status(200).json({
      message: "Monthly Scope 3 CO2e emissions calculated successfully",
      monthlyScope3Emissions: formattedMonthly
    });

  } catch (error) {
    console.error("Error calculating monthly Scope 3 CO2e:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

module.exports = {
  calculateTotalScope3Emissions
};
