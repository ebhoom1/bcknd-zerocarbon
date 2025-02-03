const purchasedgoodsservices = require('../models/PurchasedGoodServices');

// CREATE: Add a new record
exports.addpurchasedgoodsservices = async (req, res) => {
  try {
    const newRecord = new purchasedgoodsservices(req.body);
    const savedRecord = await newRecord.save();
    res.status(201).json(savedRecord);
  } catch (error) {
    res.status(500).json({ message: 'Error adding record', error });
  }
};

// READ ALL: Get all records
exports.getpurchasedgoodsservices = async (req, res) => {
  try {
    const records = await purchasedgoodsservices.find();
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching records', error });
  }
};

// READ ONE: Get a record by ID
exports.getpurchasedgoodsservicesById = async (req, res) => {
  try {
    const record = await purchasedgoodsservices.findById(req.params.id);
    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }
    res.status(200).json(record);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching record', error });
  }
};

// UPDATE: Update a record by ID (only the fields sent from frontend)
exports.updatepurchasedgoodsservices = async (req, res) => {
  try {
    const existingRecord = await purchasedgoodsservices.findById(req.params.id);
    if (!existingRecord) {
      return res.status(404).json({ message: 'Record not found' });
    }

    // Update only the fields provided in req.body
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
exports.deletepurchasedgoodsservices = async (req, res) => {
  try {
    const deletedRecord = await purchasedgoodsservices.findByIdAndDelete(req.params.id);
    if (!deletedRecord) {
      return res.status(404).json({ message: 'Record not found' });
    }
    res.status(200).json({ message: 'Record deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting record', error });
  }
};
