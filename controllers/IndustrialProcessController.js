const IndustrialProcess = require('../models/IndustrialProcess');

// Create a new industrial process record
exports.addIndustrialProcess = async (req, res) => {
    try {
        const newRecord = new IndustrialProcess(req.body);
        const savedRecord = await newRecord.save();
        res.status(201).json(savedRecord);
    } catch (error) {
        res.status(500).json({ message: "Error adding record", error });
    }
};

// Get all industrial process records
exports.getAllIndustrialProcesses = async (req, res) => {
    try {
        const records = await IndustrialProcess.find();
        res.status(200).json(records);
    } catch (error) {
        res.status(500).json({ message: "Error fetching records", error });
    }
};

// Get a single record by ID
exports.getIndustrialProcessById = async (req, res) => {
    try {
        const record = await IndustrialProcess.findById(req.params.id);
        if (!record) return res.status(404).json({ message: "Record not found" });
        res.status(200).json(record);
    } catch (error) {
        res.status(500).json({ message: "Error fetching record", error });
    }
};

// Update a record by ID (only updates provided fields)
exports.updateIndustrialProcess = async (req, res) => {
    try {
        const existingRecord = await IndustrialProcess.findById(req.params.id);
        if (!existingRecord) {
            return res.status(404).json({ message: "Record not found" });
        }

        // Update only the fields provided in the request body
        Object.keys(req.body).forEach(key => {
            existingRecord[key] = req.body[key];
        });

        const updatedRecord = await existingRecord.save();
        res.status(200).json(updatedRecord);
    } catch (error) {
        res.status(500).json({ message: "Error updating record", error });
    }
};

// Delete a record by ID
exports.deleteIndustrialProcess = async (req, res) => {
    try {
        const deletedRecord = await IndustrialProcess.findByIdAndDelete(req.params.id);
        if (!deletedRecord) return res.status(404).json({ message: "Record not found" });
        res.status(200).json({ message: "Record deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting record", error });
    }
};
