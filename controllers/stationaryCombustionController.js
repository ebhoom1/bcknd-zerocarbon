const StationaryCombustion = require("../models/StationaryCombustion");

// Get all records
exports.getAll = async (req, res) => {
  try {
    const records = await StationaryCombustion.find();
    res.status(200).json({ message: "Records fetched", records });
  } catch (err) {
    res.status(500).json({ message: "Fetch failed", error: err.message });
  }
};

// Add new record
exports.add = async (req, res) => {
  try {
    const newRecord = new StationaryCombustion(req.body);
    await newRecord.save();
    res.status(201).json({ message: "Record added", record: newRecord });
  } catch (err) {
    res.status(400).json({ message: "Add failed", error: err.message });
  }
};

// Update record
exports.update = async (req, res) => {
  try {
    const updated = await StationaryCombustion.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json({ message: "Record updated", updated });
  } catch (err) {
    res.status(400).json({ message: "Update failed", error: err.message });
  }
};

// Delete record
exports.delete = async (req, res) => {
  try {
    await StationaryCombustion.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Record deleted" });
  } catch (err) {
    res.status(400).json({ message: "Delete failed", error: err.message });
  }
};
