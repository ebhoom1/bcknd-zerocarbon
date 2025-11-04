

const MonthlySubmission = require("../../models/submission/MonthlySubmissionModel");
const MobileCombustion = require("../../models/MobileCombustion");
const MobileCombustionEmissionModel = require("../../models/emissionCalculation/mobileCombustionEmissionModel");

const fuelDensitiesTon = {
  petrol: 0.00074,
  diesel: 0.00083,
  lpg: 0.00054,
  cng: 0.00042,
};

const calculateMonthlyMobileCombustion = async (userId) => {
  console.log("called mobile")
  const resultsByMonth = {};

  try {
    const submissions = await MonthlySubmission.find({ userId });
    for (const submission of submissions) {
      const { month, responses } = submission;
      const mobileData = responses.get("Scope1:DirectEmissions_MobileCombustion");

      if (!mobileData || !Array.isArray(mobileData)) continue;

      resultsByMonth[month] = [];

      for (const record of mobileData) {
        const totalvehicles = record["MobileCombustion_Q1"];
        const vehicletype = record["MobileCombustion_Q2"];
        const vehiclename = record["MobileCombustion_Q3"];
        const fueltypeRaw = record["MobileCombustion_Q4"] || "";
        const fueltype = fueltypeRaw.toLowerCase().trim().replace(/\.$/, "");
        const fuelcombustion = parseFloat(record["MobileCombustion_Q5"]) || 0;
        const vehicledistance = record["MobileCombustion_Q6"];

        const emissionData = await MobileCombustion.findOne({
          vehicleType: { $regex: new RegExp(vehicletype, "i") },
          fuelType: { $regex: new RegExp(fueltype, "i") },
        });

        let recordData;

        if (!emissionData) {
          recordData = {
            userId,
            month,
            totalvehicles,
            vehicletype,
            vehiclename,
            fueltype,
            fuelcombustion,
            vehicledistance,
            emission: {
              CO2: "Not Found",
              CH4: "Not Found",
              N2O: "Not Found",
              CO2e: "Not Found",
            },
          };
        } else if (fueltype === "cng") {
          const fuelTon = fuelcombustion * 0.001;
          recordData = {
            userId,
            month,
            totalvehicles,
            vehicletype,
            vehiclename,
            fueltype,
            fuelcombustion,
            vehicledistance,
            emission: {
              CO2: (fuelTon * emissionData.CO2).toFixed(3),
              CH4: (fuelTon * emissionData.CH4).toFixed(6),
              N2O: (fuelTon * emissionData.N2O).toFixed(6),
              CO2e: (fuelTon * emissionData.CO2e).toFixed(3),
              totalEnergyMJ: (fuelcombustion * emissionData.NCV).toFixed(2),
            },
          };
        } else {
          const densityTon = fuelDensitiesTon[fueltype] || 0;
          const fuelcombustionKg = fuelcombustion * (densityTon * 1000);
          const totalEnergyMJ = fuelcombustionKg * parseFloat(emissionData.NCV || 0);

          recordData = {
            userId,
            month,
            totalvehicles,
            vehicletype,
            vehiclename,
            fueltype,
            fuelcombustion,
            vehicledistance,
            emission: {
              CO2: (fuelcombustion * emissionData.CO2 * densityTon).toFixed(3),
              CH4: (fuelcombustion * emissionData.CH4 * densityTon).toFixed(6),
              N2O: (fuelcombustion * emissionData.N2O * densityTon).toFixed(6),
              CO2e: (fuelcombustion * emissionData.CO2e * densityTon).toFixed(3),
              totalEnergyMJ: parseFloat(totalEnergyMJ.toFixed(2)),
            },
          };
        }

        // Optional: save to DB if not already saved
        const exists = await MobileCombustionEmissionModel.findOne({
          userId,
          month,
          vehicletype,
          vehiclename,
          fueltype,
          fuelcombustion,
          vehicledistance,
        });

        if (!exists) {
          await MobileCombustionEmissionModel.create(recordData);
        }

        resultsByMonth[month].push(recordData);
      }
    }

    return resultsByMonth;
  } catch (err) {
    console.error("calculateMonthlyMobileCombustion error:", err.message);
    return {};
  }
};

module.exports = { calculateMonthlyMobileCombustion };
