const mongoose = require('mongoose');


const ProcessFlowSchema = new mongoose.Schema({
  processName: {
    type: String,
    required: [true, 'Process name is required'],
    trim: true,
  },
  nodes: [
    {
      id: { type: String, required: true },
      data: { type: Object, required: true }, // Can store node labels, metadata, etc.
      position: {
        x: { type: Number, required: true },
        y: { type: Number, required: true },
      },
    },
  ],
  edges: [
    {
      id: { type: String, required: true }, // Unique edge identifier
      source: { type: String, required: true }, // Source node ID
      target: { type: String, required: true }, // Target node ID
      sourceHandle: { type: String, default: null }, // Handle for source node (optional)
      targetHandle: { type: String, default: null }, // Handle for target node (optional)
      type: { type: String, default: 'default' }, // Edge type (e.g., default, straight, etc.)
    },
  ],
  
},{timestamps:true});



module.exports = mongoose.model('ProcessFlow', ProcessFlowSchema);
