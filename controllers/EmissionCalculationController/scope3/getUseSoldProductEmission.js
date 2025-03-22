const UseSoldProductEmissionModel = require("../../../models/emissionCalculation/UseSoldProductEmissionModel");

const getUseSoldProductEmission = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    const emissionData = await UseSoldProductEmissionModel.find({ userId }).sort({ createdAt: -1 });

    if (!emissionData || emissionData.length === 0) {
      return res.status(200).json({ success: true, message: "No emission records found", data: [] });
    }

    res.status(200).json({
      success: true,
      message: "Use of Sold Products emission data fetched successfully",
      data: emissionData
    });
  } catch (err) {
    console.error("Error fetching use of sold products emission data:", err.message);
    res.status(500).json({ success: false, message: "Server error while fetching emissions" });
  }
};

module.exports = { getUseSoldProductEmission };
