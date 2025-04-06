const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  name: String,
  designation: String,
  DIN: String,
  category: String,
});

const sectionBSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  // Q5 & Q6
  specificCommitments: [
    {
      principle: String,
      goalTitle: String,
      baselineContext: String,
      coveredEntities: String,
      expectedOutcome: String,
      timeline: String,
      mandatoryOrVoluntary: String,
      referenceLegislation: String,
      performanceAchieved: String,
      remarks: String,
    },
  ],

  // Q7
  directorESGStatement: {
    visionStrategy: String,
    strategicPriorities: String,
    broaderTrends: String,
    keyEvents: String,
    performanceView: String,
    futureOutlook: String,
    additionalNotes: String,
  },

  // Q8
  highestAuthority: {
    implementationAuthorityType: String,
    implementationIndividual: {
      name: String,
      designation: String,
    },
    implementationCommittee: [memberSchema],
    oversightAuthorityType: String,
    oversightIndividual: {
      name: String,
      designation: String,
    },
    oversightCommittee: [memberSchema],
  },

  // Q9
  sustainabilityCommittee: {
    hasCommittee: String,
    committeeMembers: [memberSchema],
    mandate: String,
  },
});

module.exports = mongoose.model('SectionB', sectionBSchema);
