const mongoose = require('mongoose');

const FugitiveEmissionsSchema = new mongoose.Schema({
    source: { type: String,  },
    gasType: { type: String,  },
    CO2: { type: String,  }, // CO2 emissions (kg/unit)
    CH4: { type: String,  }, // CH4 emissions (kg/unit)
    N2O: { type: String,  }, // N2O emissions (kg/unit)
    SF6: { type:String,  }, // SF6 emissions (kg/unit)
    GWP_CO2e: { type: String,  }, // Global Warming Potential in CO2 equivalent
    unit: { type: String,  },
    sourceReference: { type: String,  },
    reference: { type: String,  }
});

module.exports = mongoose.model('FugitiveEmissions', FugitiveEmissionsSchema);
