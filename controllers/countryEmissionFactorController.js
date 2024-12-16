const EmissionFactor = require('../models/contryEmissionFactorModel');

// Add new country emission factor
const addEmissionFactor = async (req, res) => {
    try {
        const data = req.body;
        const newEmissionFactor = new EmissionFactor(data);
        await newEmissionFactor.save();
        return res.status(201).json({ message: 'Emission factor added successfully', data: newEmissionFactor });
    } catch (error) {
        return res.status(500).json({ message: 'Error adding emission factor', error: error.message });
    }
};

// Get all emission factors
const getAllEmissionFactors = async (req, res) => {
    try {
        const emissionFactors = await EmissionFactor.find();
        return res.status(200).json({ data: emissionFactors });
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching emission factors', error: error.message });
    }
};

// Get single emission factor by ID
const getEmissionFactorById = async (req, res) => {
    try {
        const { id } = req.params;
        const emissionFactor = await EmissionFactor.findById(id);
        if (!emissionFactor) return res.status(404).json({ message: 'Emission factor not found' });
        return res.status(200).json({ data: emissionFactor });
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching emission factor', error: error.message });
    }
};

// Update an emission factor by ID
const updateEmissionFactor = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = await EmissionFactor.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedData) return res.status(404).json({ message: 'Emission factor not found' });
        return res.status(200).json({ message: 'Emission factor updated successfully', data: updatedData });
    } catch (error) {
        return res.status(500).json({ message: 'Error updating emission factor', error: error.message });
    }
};

// Delete an emission factor by ID
const deleteEmissionFactor = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedData = await EmissionFactor.findByIdAndDelete(id);
        if (!deletedData) return res.status(404).json({ message: 'Emission factor not found' });
        return res.status(200).json({ message: 'Emission factor deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Error deleting emission factor', error: error.message });
    }
};

module.exports = {
    addEmissionFactor,
    getAllEmissionFactors,
    getEmissionFactorById,
    updateEmissionFactor,
    deleteEmissionFactor
};
