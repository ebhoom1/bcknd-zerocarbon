const mongoose = require('mongoose');

const UseSoldProductsSchema = new mongoose.Schema({
    productService: { type: String, required: true }, // Product/Service name
    category: { type: String, required: true }, // Category of the product/service
    usePhaseDescription: { type: String, required: true }, // Description of use phase
    CO2: { type: Number, required: true }, // CO₂ emissions (kg/unit)
    CH4: { type: Number, required: true }, // CH₄ emissions (kg/unit)
    N2O: { type: Number, required: true }, // N₂O emissions (kg/unit)
    CO2e: { type: Number, required: true }, // CO₂ equivalent emissions (kg/unit)
    unit: { type: String, required: true }, // Measurement unit (kg/unit, kg/T, etc.)
    source: { type: String, required: true } // Source reference
});

module.exports = mongoose.model('UseSoldProducts', UseSoldProductsSchema);
