const mongoose = require('mongoose');

const FugitiveEmissionsSchema = new mongoose.Schema({
    source: { type: String,  },
    gasType: { type: String,  },
    CO2: { type: Number,  }, // CO2 emissions (kg/unit)
    CH4: { type: Number,  }, // CH4 emissions (kg/unit)
    N2O: { type: Number,  }, // N2O emissions (kg/unit)
    SF6: { type: Number,  }, // SF6 emissions (kg/unit)
    GWP_CO2e: { type: Number,  }, // Global Warming Potential in CO2 equivalent
    unit: { type: String,  },
    sourceReference: { type: String,  },
    reference: { type: String,  }
});

module.exports = mongoose.model('FugitiveEmissions', FugitiveEmissionsSchema);
