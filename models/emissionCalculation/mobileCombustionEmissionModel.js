const mongoose = require('mongoose');

const EmissionDetailsSchema = new mongoose.Schema({
  CO2: { type: String },
  CH4: { type: String },
  N2O: { type: String },
  CO2e: { type: String },
  totalEnergyMJ: { type: Number }
}, { _id: false });

const MobileCombustionEmissionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  month: { type: String},
  totalvehicles: { type: String },
  vehicletype: { type: String },
  vehiclename: { type: String },
  fueltype: { type: String },
  fuelcombustion: { type: Number },
  vehicledistance: { type: String },
  CO2: { type: String },
  CH4: { type: String },
  N2O: { type: String },
  CO2e: { type: String },
  emission: EmissionDetailsSchema
}, { timestamps: true });

module.exports = mongoose.model('MobileCombustionEmission', MobileCombustionEmissionSchema);
