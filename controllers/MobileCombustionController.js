const MobileCombustion = require('../models/MobileCombustion');

// Create a new record
exports.addMobileCombustion = async (req, res) => {
    try {
        const newRecord = new MobileCombustion(req.body);
        const savedRecord = await newRecord.save();
        res.status(201).json({message:"mobile combustion data added successfully",savedRecord});
    } catch (error) {
        res.status(500).json({ message: "Error adding record", error });
    }
};

// Get all records
exports.getAllMobileCombustion = async (req, res) => {
    try {
        const records = await MobileCombustion.find();
        res.status(200).json({message:"data get successfully",records});
    } catch (error) {
        res.status(500).json({ message: "Error fetching records", error });
    }
};

// Get a single record by ID
exports.getMobileCombustionById = async (req, res) => {
    try {
        const record = await MobileCombustion.findById(req.params.id);
        if (!record) return res.status(404).json({ message: "Record not found" });
        res.status(200).json(record);
    } catch (error) {
        res.status(500).json({ message: "Error fetching record", error });
    }
};

// Update a record by ID
exports.updateMobileCombustion = async (req, res) => {
    try {
        const existingRecord = await MobileCombustion.findById(req.params.id);
        if (!existingRecord) {
            return res.status(404).json({ message: "Record not found" });
        }

        // Update only the fields provided in the request body
        Object.keys(req.body).forEach(key => {
            existingRecord[key] = req.body[key];
        });

        const updatedRecord = await existingRecord.save();
        res.status(200).json({message:"updated successfully",updatedRecord});
    } catch (error) {
        res.status(500).json({ message: "Error updating record", error });
    }
};

// Delete a record by ID
exports.deleteMobileCombustion = async (req, res) => {
    try {
        const deletedRecord = await MobileCombustion.findByIdAndDelete(req.params.id);
        if (!deletedRecord) return res.status(404).json({ message: "Record not found" });
        res.status(200).json({ message: "Record deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting record", error });
    }
};
