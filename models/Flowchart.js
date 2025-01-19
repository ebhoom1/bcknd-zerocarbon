const mongoose = require('mongoose');

const NodeSchema = new mongoose.Schema({
  // id: { type: String, required: true },
  id: { type: mongoose.Schema.Types.ObjectId, required: true }, // Use ObjectId instead of String
  label: { type: String, required: true },
  position: {
    x: { type: Number, required: true },
    y: { type: Number, required: true },
  },
  parentNode: { type: String, default: null },
  details: {
    boundaryDetails: {
      boundaryType: { type: String, default: null },
      controlApproach: { type: String, default: null },
      location: { type: String, default: null },
      boundaryComments: { type: String, default: null },
    },
    scopeDetails: [
      {
        scopeType: { type: String,  },
        category: { type: String, },
        subCategory: { type: String,  },
        units: { type: String, },
        emissionFactor: { type: String,  },
        fuel:{type: String,},
        activity:{type: String,},
        source:{type: String,},
        reference:{type: String,},
        scopeComments: { type: String, default: null },
      },
    ],
  },
});

const EdgeSchema = new mongoose.Schema({
  id: { type: String, required: true },
  source: { type: String, required: true },
  target: { type: String, required: true },
});

const FlowchartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  nodes: [NodeSchema],
  edges: [EdgeSchema],
});

const Flowchart = mongoose.model('Flowchart', FlowchartSchema);

module.exports = Flowchart;
