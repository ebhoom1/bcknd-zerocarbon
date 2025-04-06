// // controllers/dashboard/getMonthlyEmissions.js
// const MobileCombustionEmissionModel = require("../../models/emissionCalculation/mobileCombustionEmissionModel");
// const StationaryCombustionEmissionModel = require("../../models/emissionCalculation/stationaryCombustionEmissionModel");
// const IndustrialProcessesEmissionModel = require("../../models/emissionCalculation/industrialProcessesEmissionModel");
// const FugitiveEmissionModel = require("../../models/emissionCalculation/fugitiveEmissionModel");
// const PurchasedElectricityModel = require("../../models/emissionCalculation/PurchasedElectricityModel");
// const PurchasedSteamHeatCoolingModel= require("../../models/emissionCalculation/PurchasedSteamHeatCoolingModel");
// const UseSoldProductEmissionModel = require("../../models/emissionCalculation/UseSoldProductEmissionModel");
// const PurchasedGoodsServicesModel = require("../../models/emissionCalculation/PurchasedGoodsServicesModel");
// const EndOfLifeTreatmentModel = require("../../models/emissionCalculation/EndOfLifeTreatmentModel");
// const MonthlySubmission=require("../../models/submission/MonthlySubmissionModel")

// const getTotalMonthlyEmissions = async (userId, month) => {
//     const monthQuery = { userId, month }; // Assuming `month` field exists in all emission models
  
//     const [
//       mobile, stationary, industrial, fugitive,
//       electricity, steam,
//       useSold, purchasedGoods, endOfLife
//     ] = await Promise.all([
//       MobileCombustionEmissionModel.aggregate([{ $match: monthQuery }, { $group: { _id: null, total: { $sum: "$emission.CO2e" } } }]),
//       StationaryCombustionEmissionModel.aggregate([{ $match: monthQuery }, { $group: { _id: null, total: { $sum: "$emission.totalCO2e" } } }]),
//       IndustrialProcessesEmissionModel.aggregate([{ $match: monthQuery }, { $group: { _id: null, total: { $sum: "$emission.CO2e" } } }]),
//       FugitiveEmissionModel.aggregate([{ $match: monthQuery }, { $group: { _id: null, total: { $sum: "$emission.CO2e" } } }]),
//       PurchasedElectricityModel.aggregate([{ $match: monthQuery }, { $group: { _id: null, total: { $sum: "$emissionKgCO2e" } } }]),
//       PurchasedSteamHeatCoolingModel.aggregate([{ $match: monthQuery }, { $group: { _id: null, total: { $sum: "$totalEmission" } } }]),
//       UseSoldProductEmissionModel.aggregate([{ $match: monthQuery }, { $group: { _id: null, total: { $sum: "$CO2e" } } }]),
//       PurchasedGoodsServicesModel.aggregate([{ $match: monthQuery }, { $group: { _id: null, total: { $sum: "$emissionCO2e" } } }]),
//       EndOfLifeTreatmentModel.aggregate([{ $match: monthQuery }, { $group: { _id: null, total: { $sum: "$CO2e" } } }]),
//     ]);
  
//     const sum = (...arr) => (arr[0]?.total || 0);
  
//     return parseFloat((
//       sum(mobile) +
//       sum(stationary) +
//       sum(industrial) +
//       sum(fugitive) +
//       sum(electricity) +
//       sum(steam) +
//       sum(useSold) +
//       sum(purchasedGoods) +
//       sum(endOfLife)
//     ).toFixed(2));
//   };

  
//   // controllers/dashboard/getYearlyMonthlyEmissions.js
// const getMonthName = (monthStr) => {
//     const [year, month] = monthStr.split("-");
//     const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
//                     "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
//     return { year, name: months[parseInt(month) - 1] };
//   };
  
//   const getYearlyMonthlyEmissions = async (req, res) => {
//     try {
//       const { userId } = req.params;
  
//       // Fetch all monthly submissions
//       const submissions = await MonthlySubmission.find({ userId });
  
//       const emissionData = {};
  
//       for (const { month } of submissions) {
//         const yearMonth = getMonthName(month);
//         const totalCO2e = await getTotalMonthlyEmissions(userId, month); // You create this
  
//         if (!emissionData[yearMonth.year]) emissionData[yearMonth.year] = [];
  
//         emissionData[yearMonth.year].push({
//           month: yearMonth.name,
//           emissions: totalCO2e,
//         });
//       }
  
//       return res.status(200).json({ success: true, data: emissionData });
  
//     } catch (err) {
//       console.error("Yearly CO2e Fetch Error:", err.message);
//       return res.status(500).json({ success: false, message: err.message });
//     }
//   };
  
//   module.exports = { getYearlyMonthlyEmissions };
  

// controllers/emissions/getMonthlyTotalEmissions.js

const MobileCombustion = require("../../models/emissionCalculation/mobileCombustionEmissionModel");
const StationaryCombustion = require("../../models/emissionCalculation/stationaryCombustionEmissionModel");
const IndustrialProcesses = require("../../models/emissionCalculation/industrialProcessesEmissionModel");
const FugitiveEmissions = require("../../models/emissionCalculation/fugitiveEmissionModel");
const PurchasedElectricity = require("../../models/emissionCalculation/PurchasedElectricityModel");
const PurchasedSteamHeatCooling = require("../../models/emissionCalculation/PurchasedSteamHeatCoolingModel");
const UseOfSoldProducts = require("../../models/emissionCalculation/UseSoldProductEmissionModel");
const PurchasedGoodsServices = require("../../models/emissionCalculation/PurchasedGoodsServicesModel");
const EndOfLifeTreatment = require("../../models/emissionCalculation/EndOfLifeTreatmentModel");

const models = [
  { name: "MobileCombustion", model: MobileCombustion, getCO2e: (e) => parseFloat(e.emission?.CO2e || 0) },
  { name: "StationaryCombustion", model: StationaryCombustion, getCO2e: (e) => parseFloat(e.emission?.totalCO2e || 0) },
  { name: "IndustrialProcesses", model: IndustrialProcesses, getCO2e: (e) => parseFloat(e.emission?.CO2e || 0) },
  { name: "FugitiveEmissions", model: FugitiveEmissions, getCO2e: (e) => parseFloat(e.emission?.CO2e || 0) },
  { name: "PurchasedElectricity", model: PurchasedElectricity, getCO2e: (e) => parseFloat(e.emissionKgCO2e || 0) },
  { name: "PurchasedSteamHeatCooling", model: PurchasedSteamHeatCooling, getCO2e: (e) => parseFloat(e.totalEmission || 0) },
  { name: "UseOfSoldProducts", model: UseOfSoldProducts, getCO2e: (e) => parseFloat(e.CO2e || 0) },
  { name: "PurchasedGoodsServices", model: PurchasedGoodsServices, getCO2e: (e) => parseFloat(e.emissionCO2e || 0) },
  { name: "EndOfLifeTreatment", model: EndOfLifeTreatment, getCO2e: (e) => parseFloat(e.CO2e || 0) },
];

const getMonthlyTotalEmissions = async (req, res) => {
  try {
    const { userId } = req.params;
    const monthlyMap = {};

    for (const { name, model: Model, getCO2e } of models) {
      const entries = await Model.find({ userId });
      // console.log(`\n--- ${name} ---`);

      for (const entry of entries) {
        const { month } = entry;
        const co2e = getCO2e(entry);
        // console.log(`Month: ${month}, CO2e: ${co2e}`);

        if (!month) continue;

        if (!monthlyMap[month]) monthlyMap[month] = 0;
        monthlyMap[month] += isNaN(co2e) ? 0 : co2e;
      }
    }

    // Format for frontend chart
    const formatted = Object.entries(monthlyMap)
      .map(([month, emissions]) => ({ month, emissions }))
      .sort((a, b) => new Date(`1 ${a.month}`) - new Date(`1 ${b.month}`));

    // Group by year
    const byYear = {};
    for (const item of formatted) {
      const year = item.month.split("-")[1]; // e.g., "Apr-2025" => "2025"
      if (!byYear[year]) byYear[year] = [];
      byYear[year].push(item);
    }

    // console.log("\n=== Final Monthly CO2e Total ===");
    // console.log(byYear);

    res.status(200).json({ success: true, data: byYear });
  } catch (err) {
    console.error("Error calculating total emissions:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = {getMonthlyTotalEmissions};
