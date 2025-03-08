const mongoose = require('mongoose');

const IndustrialProcessSchema = new mongoose.Schema({
    industryType: { type: String, },
    emissionSource: { type: String, },
    CO2: { type: String }, // CO2 emissions (kg/unit)
    CH4: { type: String }, // CH4 emissions (kg/unit)
    N2O: { type: String }, // N2O emissions (kg/unit)
    CO2e: { type: String }, // CO2 equivalent emissions (kg/unit)
    unit: { type: String, },
    source: { type: String, },
    reference: { type: String, }
});

module.exports = mongoose.model('IndustrialProcess', IndustrialProcessSchema);
