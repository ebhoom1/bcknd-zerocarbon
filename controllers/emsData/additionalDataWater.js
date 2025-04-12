const axios = require("axios");

const getCarbonFromFlow = async (req, res) => {
  try {
    const { userName } = req.query;

    if (!userName) {
      return res.status(400).json({ success: false, message: "userName is required" });
    }

    const apiUrl = `https://api.ocems.ebhoom.com/api/total-cumulating-flow?userName=${userName}`;
    const response = await axios.get(apiUrl);
    const data = response.data?.data;
    if (!data) {
      return res.status(404).json({ success: false, message: "No EMS data found." });
    }

    let totalConsumption = 0;

    for (const val of Object.values(data)) {
      totalConsumption += parseFloat(val);
    }
    // const carbonEmission = parseFloat((totalConsumption * 0.708).toFixed(2));
    const carbonEmission = totalConsumption * 0.708;

    res.status(200).json({
      success: true,
    //   totalConsumption: parseFloat(totalConsumption.toFixed(2)),
      totalConsumption,
      carbonEmission
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

module.exports = getCarbonFromFlow;
