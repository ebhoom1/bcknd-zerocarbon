// controllers/scope3/getPurchasedGoodsServices.js
const PurchasedGoodsServicesModel = require("../../../models/emissionCalculation/PurchasedGoodsServicesModel");

const getPurchasedGoodsServicesEmission = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    const emissions = await PurchasedGoodsServicesModel.find({ userId }).sort({ createdAt: -1 }).lean();

    if (!emissions || emissions.length === 0) {
      return res.status(404).json({ success: false, message: "No emission records found for this user." });
    }

    const formatted = emissions.map((item, index) => ({
      serialNo: index + 1,
      material: item.material,
      quantity: `${item.quantity} ${item.quantityUnit}`,
      emissionFactorCO2: `${item.emissionFactorCO2} kg CO₂`,
      emissionFactorCH4: `${item.emissionFactorCH4} kg CH₄`,
      emissionFactorN2O: `${item.emissionFactorN2O} kg N₂O`,
      emissionFactorCO2e: `${item.emissionFactorCO2e} kg CO₂e`,
      emissionCO2: item.emissionCO2.toFixed(2),
      emissionCH4: item.emissionCH4.toFixed(2),
      emissionN2O:item.emissionN2O.toFixed(2),
      emissionCO2e: item.emissionCO2e.toFixed(2),
      calculatedAt: new Date(item.createdAt).toLocaleString()
    }));

    res.status(200).json({
      success: true,
      data: formatted
    });
  } catch (err) {
    console.error("Error fetching Purchased Goods & Services emissions:", err.message);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

module.exports = { getPurchasedGoodsServicesEmission };