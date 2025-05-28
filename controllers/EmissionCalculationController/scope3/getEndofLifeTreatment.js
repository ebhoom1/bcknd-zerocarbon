// controllers/scope3/getEndofLifeTreatment.js

const EndofLifeTreatmentModel=require("../../../models/emissionCalculation/EndOfLifeTreatmentModel")

const getEndOfLifeTreatmentEmission = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    const emissions = await EndofLifeTreatmentModel.find({ userId }).sort({ createdAt: -1 }).lean();

    if (!emissions || emissions.length === 0) {
      return res.status(404).json({ success: false, message: "No end-of-life treatment records found for this user." });
    }

    const formatted = emissions.map((item, index) => ({
      serialNo: index + 1,
      month:item.month,
      product: item.product,
      method: item.method,
      percentage: item.percentage,
      quantity: `${item.quantity} ${item.unit}`, // Shows quantity with user-selected unit
      emissionFactorCO2: `${item.emissionFactor_CO2} `,
      emissionFactorCH4: `${item.emissionFactor_CH4} `,
      emissionFactorN2O: `${item.emissionFactor_N2O} `,
      emissionFactorCO2e: `${item.emissionFactor_CO2e} `,
      emissionCO2: item.CO2.toFixed(2),
      emissionCH4: item.CH4.toFixed(2),
      emissionN2O: item.N2O.toFixed(2),
      emissionCO2e: item.CO2e.toFixed(2),
      unitUsed: item.unitUsed, // Shows emission factor unit (kg/T or kg/unit)
      calculatedAt: new Date(item.createdAt).toLocaleString()
    }));

    res.status(200).json({
      success: true,
      data: formatted
    });
  } catch (err) {
    console.error("Error fetching End-of-Life Treatment emissions:", err.message);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

module.exports = { getEndOfLifeTreatmentEmission };
