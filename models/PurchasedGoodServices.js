const mongoose = require('mongoose');

const purchasedgoodsservicesSchema = new mongoose.Schema({
  productService: { type: String,  }, // "Product/Service"
  category: { type: String,  },
  CO2: { type: String,  },   // CO₂ (kg/unit)
  CH4: { type: String,  },   // CH₄ (kg/unit)
  N2O: { type: String,  },   // N₂O (kg/unit)
  CO2e: { type: String,  },  // CO₂e (kg/unit)
  unit: { type: String,  },  // e.g., "kg/T", "kg/L", etc.
  source: { type: String,  }, // The "Source" column
});

module.exports = mongoose.model('purchasedgoodsservices', purchasedgoodsservicesSchema);
