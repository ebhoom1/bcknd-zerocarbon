const MonthlySubmission = require("../../models/submission/MonthlySubmissionModel");

const getMonthlyEnergyWater = async (req, res) => {
  const { userId } = req.params;

  try {
    const submissions = await MonthlySubmission.find({ userId });

    const yearData = {};

    for (const entry of submissions) {
      const monthField = entry.month; // e.g., "Apr-2025"
      const [month, year] = monthField.split("-");
      if (!month || !year) continue;

      const responses = entry.responses || {};
      let energy = 0;
      let water = 0;

      // ✅ ENERGY → PurchasedElectricity_Q1 from Scope2:IndirectEmissions_PurchasedElectricity
      const electricityArray = responses.get("Scope2:IndirectEmissions_PurchasedElectricity");
      console.log(electricityArray);
      if (Array.isArray(electricityArray) && electricityArray.length > 0) {
        const value = electricityArray[0]["PurchasedElectricity_Q1"];
        energy = parseFloat(value) ;
      }

      // ✅ WATER → WaterUse&WastewaterTreatment_Q1 from AdditionalDataforCarbonAccounting_WaterUse&WastewaterTreatment
      const waterArray = responses.get("AdditionalDataforCarbonAccounting_WaterUse&WastewaterTreatment");
      if (Array.isArray(waterArray) && waterArray.length > 0) {
        const value = waterArray[0]["WaterUse&WastewaterTreatment_Q1"];
        water = parseFloat(value) ;
      }

      // Organize by year
      if (!yearData[year]) {
        yearData[year] = [];
      }

      yearData[year].push({
        month: `${month}-${year}`, // e.g., "Apr-2025"
        energy,
        water
      });
    }

    console.log("✅ Energy-Water Value:", yearData);
    return res.status(200).json({ success: true, data: yearData });

  } catch (err) {
    console.error("❌ Error fetching energy/water:", err.message);
    return res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

module.exports = getMonthlyEnergyWater;