const UseSoldProducts = require('../models/useSoldProducts');

// CREATE: Add a new record
exports.addUseSoldProduct = async (req, res) => {
    try {
        const newRecord = new UseSoldProducts(req.body);
        const savedRecord = await newRecord.save();
        res.status(201).json(savedRecord);
    } catch (error) {
        res.status(500).json({ message: 'Error adding record', error });
    }
};

// READ ALL: Get all records
exports.getAllUseSoldProducts = async (req, res) => {
    try {
        const records = await UseSoldProducts.find();
        res.status(200).json(records);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching records', error });
    }
};

// READ ONE: Get a record by ID
exports.getUseSoldProductById = async (req, res) => {
    try {
        const record = await UseSoldProducts.findById(req.params.id);
        if (!record) {
            return res.status(404).json({ message: 'Record not found' });
        }
        res.status(200).json(record);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching record', error });
    }
};

// UPDATE: Update a record by ID (only updates provided fields)
exports.updateUseSoldProduct = async (req, res) => {
    try {
        const existingRecord = await UseSoldProducts.findById(req.params.id);
        if (!existingRecord) {
            return res.status(404).json({ message: 'Record not found' });
        }

        Object.keys(req.body).forEach((key) => {
            existingRecord[key] = req.body[key];
        });

        const updatedRecord = await existingRecord.save();
        res.status(200).json(updatedRecord);
    } catch (error) {
        res.status(500).json({ message: 'Error updating record', error });
    }
};

// DELETE: Remove a record by ID
exports.deleteUseSoldProduct = async (req, res) => {
    try {
        const deletedRecord = await UseSoldProducts.findByIdAndDelete(req.params.id);
        if (!deletedRecord) {
            return res.status(404).json({ message: 'Record not found' });
        }
        res.status(200).json({ message: 'Record deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting record', error });
    }
};
