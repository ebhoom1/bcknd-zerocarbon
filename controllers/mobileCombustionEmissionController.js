const Submission = require("../models/Submission");
const MobileCombustion = require("../models/MobileCombustion");

// Default Fuel Densities (kg/L)
const fuelDensities = {
  petrol: 0.74,
  diesel: 0.84,
  lpg: 0.50,
  cng: 0.65,
};

const getMobileCombustionEmissionData = async (req, res) => {
  try {
    const { userId } = req.params;
console.log("userid:",userId)
    const submission = await Submission.findOne({ userId });
    if (!submission || !submission.responses || !submission.responses.get("Scope1:DirectEmissions_MobileCombustion")) {
      return res.status(404).json({ message: "No Mobile Combustion data found for this user." });
    }

    const mobileData = submission.responses.get("Scope1:DirectEmissions_MobileCombustion");
    const result = [];

    for (const record of mobileData) {
      const totalvehicles = record["MobileCombustion_Q1"];
      const vehicletype = record["MobileCombustion_Q2"];
      const vehiclename = record["MobileCombustion_Q3"];
      const fueltype = record["MobileCombustion_Q4"].toLowerCase().replace(/\.$/, ''); // remove dot if any
      const fuelcombustion = record["MobileCombustion_Q5"];
      const vehicledistance = record["MobileCombustion_Q6"];

      // Find matching emission factor from MobileCombustion DB
      const emissionData = await MobileCombustion.findOne({
        vehicleType: { $regex: new RegExp(vehicletype, "i") },
        fuelType: { $regex: new RegExp(fueltype, "i") },
      });

      if (!emissionData) {
        result.push({
          totalvehicles,
          vehicletype,
          vehiclename,
          fueltype,
          fuelcombustion,
          vehicledistance,
          CO2: "Not Found",
          CH4: "Not Found",
          N2O: "Not Found",
          CO2e: "Not Found",
        });
        continue;
      }

      const density = fuelDensities[fueltype] || 1; // fallback default = 1 if unknown

      // Convert from kg/T to kg/L
      const CO2_kgL = (parseFloat(emissionData.CO2) / 1000) * density;
      const CH4_kgL = (parseFloat(emissionData.CH4) / 1000) * density;
      const N2O_kgL = (parseFloat(emissionData.N2O) / 1000) * density;
      const CO2e_kgL = (parseFloat(emissionData.CO2e) / 1000) * density;

      result.push({
        totalvehicles,
        vehicletype,
        vehiclename,
        fueltype,
        fuelcombustion,
        vehicledistance,
        CO2: CO2_kgL.toFixed(3),
        CH4: CH4_kgL.toFixed(6),
        N2O: N2O_kgL.toFixed(6),
        CO2e: CO2e_kgL.toFixed(3),
      });
    }
console.log("result:",result);
    res.status(200).json({ userId, emissions: result });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

module.exports = { getMobileCombustionEmissionData };
