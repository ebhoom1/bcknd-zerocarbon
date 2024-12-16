const mongoose = require('mongoose');

const CountryEmissionFactorSchema = new mongoose.Schema({
    country: { type: String, required: true },
    regionGrid: { type: String, required: true },
    emissionFactor: { type: String, required: true }, // tCO2/MWh
    reference: { type: String, default: "" },
    unit: { type: String, default: 'tCO2/MWh' },
    yearlyValues: [
        {
            year: { type: String, required: true },
            value: { type: Number, required: true }
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model('ContryEmissionFactor', CountryEmissionFactorSchema);