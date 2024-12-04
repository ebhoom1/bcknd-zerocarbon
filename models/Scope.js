const mongoose = require('mongoose');

const ScopeSchema = new mongoose.Schema({
  boundaryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Boundary', required: true },
  scopeType: { type: String, required: true },
  category: { type: String, required: true },
  subCategory: { type: String },
  units: { type: String },
  emissionFactor: { type: String },
  comments: { type: String },
});

module.exports = mongoose.model('Scope', ScopeSchema);
