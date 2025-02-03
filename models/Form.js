
// const mongoose = require("mongoose");

// const formSchema = new mongoose.Schema({
//   userId:{type:mongoose.Schema.ObjectId,ref:'User',required:true},
//   companyName: { type: String, required: true },
//   companyAddress: { type: String, required: true },
//   primaryContact: {
//     name: { type: String, required: true },
//     title: { type: String, required: true },
//     email: { type: String, required: true },
//     phone: { type: String, required: true },
//   },
//   altContact: { 
//     name: { type: String},
//     title: { type: String },
//     email: { type: String },
//     phone: { type: String},
//   },
//   industrySector: { type: String, required: true },
//   description: { type: String, required: true },
//   operationalSites: { type: String, required: true },
//   totalEmployees: { type: String, required: true },
//   fiscalYear: { type: String, required: true },
//   scope1: {
//     stationaryCombustion: { type: Boolean, default:false},
//     mobileSources: { type: Boolean, default: false },
//     refrigerationandAirConditioning: { type: Boolean, default: false },
//     processemission: { type: Boolean, default: false },
//   },
//   scope2: {
//     electricity: { type: Boolean, default: false },
//     steam: { type: Boolean, default: false },
//   },
//   scope3: {
//     businessTravel: { type: Boolean, default: false },
//     employeeCommuting: { type: Boolean, default: false },
//     upstreamTransportationandDistribution: { type: Boolean, default: false },
//     wasteGeneratedinOperations: { type: Boolean, default: false },
//   },
//   upstreamActivities: [{ type: String }], // Array to hold multiple options
//     downstreamActivities: [{ type: String }], // Array to hold multiple options
//   dataCollectionMethod: { type: String, required: true },
//   reportingFrequency: { type: String, required: true },
//   supportingDocuments: { type: String, required: true },
//   organizationalBoundaries: { type: String, required: true },
//   declarationConfirmation: { type: Boolean, default: false },
//   signatureName: { type: String, required: true },
//   date: { type: Date, default: Date.now },
//   isRead:{type:Boolean,default:false},
//   status:{type:String,default:"Not started"}
// },{timestamps:true});

// const Form = mongoose.model("Form", formSchema);

// module.exports = Form;


//new
const mongoose = require("mongoose");

const formSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  companyName: { type: String, required: true },
  companyAddress: { type: String, required: true },
  primaryContact: {
    name: { type: String, required: true },
    title: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
  },
  altContact: { 
    name: { type: String },
    title: { type: String },
    email: { type: String },
    phone: { type: String },
  },
  industrySector: { type: String, required: true },
  description: { type: String, required: true },
  operationalSites: { type: String, required: true },
  totalEmployees: { type: String, required: true },
  fiscalYear: { type: String, required: true },

  scope1: {
    stationaryCombustion: { type: Boolean, default: false },
    mobileSources: { type: Boolean, default: false },
    refrigerationandAirConditioning: { type: Boolean, default: false },
    processemission: { type: Boolean, default: false },
  },
  scope2: {
    electricity: { type: Boolean, default: false },
    steam: { type: Boolean, default: false },
  },
  scope3: {
    businessTravel: { type: Boolean, default: false },
    employeeCommuting: { type: Boolean, default: false },
    upstreamTransportationandDistribution: { type: Boolean, default: false },
    wasteGeneratedinOperations: { type: Boolean, default: false },
  },

  upstreamActivities: [{ type: String }], 
  downstreamActivities: [{ type: String }], 

  dataCollectionMethod: { type: String, required: true },
  reportingFrequency: { type: String, required: true },
  supportingDocuments: { type: String, required: true },
  organizationalBoundaries: { type: String, required: true },
  declarationConfirmation: { type: Boolean, default: false },
  signatureName: { type: String, required: true },
  date: { type: Date, default: Date.now },

  // New Step 5: Social Practices
  socialPractices: {
    communityInitiatives: { type: Boolean, default: false },
    deiMetricsTracked: { type: Boolean, default: false },
    codeOfConduct: { type: Boolean, default: false },
    sustainableLocalProcurement: { type: Boolean, default: false },
    healthWellnessInitiatives: { type: Boolean, default: false },
    sustainabilityDiversityTraining: { type: Boolean, default: false },
    employeeFeedbackMechanisms: { type: Boolean, default: false },
    communityOutreachPrograms: { type: Boolean, default: false },
    localOrganizationPartnerships: { type: Boolean, default: false },
    guestParticipation: { type: Boolean, default: false }
  },

  // New Step 6: Governance Practices / Awards and Recognition
  governancePractices: {
    appliedForESGAwards: { type: Boolean, default: false },
    existingPolicies: { type: Boolean, default: false },
    responsibleProcurement: { type: Boolean, default: false },
    certifiedSuppliers: { type: Boolean, default: false },
    automatedMonitoringSystems: { type: Boolean, default: false },
    dataCollectionVerification: { type: Boolean, default: false },
    periodicDataReview: { type: Boolean, default: false },
    kpiTracking: { type: Boolean, default: false },
    stakeholderEngagement: { type: Boolean, default: false },
    validCertifications: { type: Boolean, default: false },
    alignedWithSDGs: { type: Boolean, default: false },
    esgReportingPlan: { type: Boolean, default: false },
    supportingDocumentsCompiled: { type: Boolean, default: false },
    ecoFriendlyEventPractices: { type: Boolean, default: false },
    energyEfficientEventSpaces: { type: Boolean, default: false },
    eventCarbonFootprintMeasurement: { type: Boolean, default: false },
    wasteSegregationForEvents: { type: Boolean, default: false },
    sustainabilityReportsForEvents: { type: Boolean, default: false },
    esgLeadershipRecognition: { type: Boolean, default: false },
    greenHotelierMetricsDocumented: { type: Boolean, default: false }
  },

  isRead: { type: Boolean, default: false },
  status: { type: String, default: "Not started" }
}, { timestamps: true });

const Form = mongoose.model("Form", formSchema);

module.exports = Form;
