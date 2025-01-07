const CalculationOfElectricity = require('../models/CalculationOfElectricity');
const CountryEmissionFactor = require('../models/contryEmissionFactorModel');
const moment = require('moment');
const mongoose = require('mongoose');

exports.calculateAndSaveElectricityEmission = async (req, res) => {
  try {
    const {
      scopeDetail,
      userId,
      country,
      region,
      emissionFactor,
      consumedAmount,
      periodOfDate,
      startDate,
      uncertaintyLevelConsumedData = 0,
      uncertaintyLevelEmissionFactor = 0,
    } = req.body;

    // Step 1: Calculate endDate
    let endDate;
    if (periodOfDate === "monthly") {
      endDate = moment(startDate, "DD/MM/YYYY").add(1, "month").format("DD/MM/YYYY");
    } else if (periodOfDate === "2-months") {
      endDate = moment(startDate, "DD/MM/YYYY").add(2, "months").format("DD/MM/YYYY");
    } else if (periodOfDate === "yearly") {
      endDate = moment(startDate, "DD/MM/YYYY").add(1, "year").format("DD/MM/YYYY");
    } else {
      return res.status(400).json({ message: "Invalid periodOfDate. Use 'monthly', '2-months', or 'yearly'." });
    }

    // Step 2: Check for existing data in the same period
    const existingRecord = await CalculationOfElectricity.findOne({
      userId,
      $or: [
        { startDate: { $regex: `.*${moment(startDate, "DD/MM/YYYY").format("MM/YYYY")}$`, $options: "i" } },
        { endDate: { $regex: `.*${moment(endDate, "DD/MM/YYYY").format("MM/YYYY")}$`, $options: "i" } },
      ],
    });

    if (existingRecord) {
      return res.status(400).json({ message: `A record already exists for the specified period.` });
    }

    // Step 3: Match data in CountryEmissionFactor
    const emissionFactorData = await CountryEmissionFactor.findOne({
      country,
      regionGrid: region,
      emissionFactor,
    });

    if (!emissionFactorData) {
      return res.status(404).json({ message: "No matching emission factor data found." });
    }

    // Find the matching yearly value range
    const matchingYearlyValue = emissionFactorData.yearlyValues.find((value) => {
      const fromDate = moment(value.from, "DD/MM/YYYY");
      const toDate = moment(value.to, "DD/MM/YYYY");
      const userStartDate = moment(startDate, "DD/MM/YYYY");
      const userEndDate = moment(endDate, "DD/MM/YYYY");

      return userStartDate.isBetween(fromDate, toDate, null, "[]") ||
             userEndDate.isBetween(fromDate, toDate, null, "[]");
    });

    if (!matchingYearlyValue) {
      return res.status(404).json({ message: "No matching yearly value found for the given date range." });
    }

    // Step 4: Calculate emissions
    const adjustedConsumedData = consumedAmount * (1 + uncertaintyLevelConsumedData / 100);
    const adjustedEmissionFactor = matchingYearlyValue.value * (1 + uncertaintyLevelEmissionFactor / 100);

    const emissionCO2e = adjustedConsumedData * adjustedEmissionFactor;

    // Save data
    const newCalculation = new CalculationOfElectricity({
      scopeDetail,
      userId,
      country,
      region,
      emissionFactor,
      consumedAmount,
      periodOfDate,
      startDate,
      endDate,
      uncertaintyLevelConsumedData,
      uncertaintyLevelEmissionFactor,
      emissionCO2e,
    });

    await newCalculation.save();
    return res.status(201).json({ message: "Electricity emission calculation saved successfully.", data: newCalculation });
  } catch (error) {
    console.error("Error calculating electricity emissions:", error.message);
    return res.status(500).json({ message: "An error occurred while calculating emissions.", error: error.message });
  }
};
