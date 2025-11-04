const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const bodyParser = require("body-parser");
const path = require("path");

// Import Routes
const userR = require("./router/userR");
const adminR = require("./router/adminR");
const authR = require("./router/authR");
const flowchartR = require("./router/flowchartR");
const gwpRoutes = require("./router/gwpRoutes");
const CountryemissionFactorRouter = require("./router/countryemissionFactorRouter");
const mobileCombustionRoutes = require('./router/mobileCombustionRoutes');
const stationaryRoutes = require('./router/stationaryCombustionRoutes');
const industrialProcessRoutes = require('./router/industrialProcessRoutes');
const fugitiveEmissionsRoutes=require('./router/fugitiveEmissionsRoutes');
const endOfLifeTreatmentRoutes = require('./router/endOfLifeTreatmentRoutes');
const purchasedgoodsservicesR=require('./router/purchasedgoodsservicesR');
const useSoldProductsRoutes = require('./router/useSoldProductsRoutes');
const submissionRoutes = require("./router/submissionRoutes");
const analyseDecarbonizationRoadmap = require('./router/analyseDecarbonizationRoadmap');
const renewableEnergyCalculate=require('./router/renewableEnergyCalculateR')
const emissionReductionSimulator=require('./router/emissionReductionSimulator');
const reportRoutes = require("./router/reportRoutes");
const emissionCalculation=require('./router/EmissionCalculation/emissionCalculationRoutes');
const userdashboardRoutes=require("./router/userDashboard/dashboard");
const admindashboardRoutes=require("./router/admindashboard/adminDashboardRoutes");
const governanceUploadsecSubmission=require("./router/governanceUploadsecSubmissionoutes/governanceRoutes")
const additionalDataWater=require("./router/emsData/waterRoutes")
const addDynamicQuestion=require("./router/surveyQuestion/surveyQuestionRoutes")
const griRoutes = require("./router/GRIrouter/griRoutes");
const griReportRoutes = require("./router/GRIrouter/GRIReportRoutes");

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
    origin: ["http://localhost:3000","https://esg.ebhoom.com","http://localhost:3001"],
    credentials: true,
}));


// Routes
app.use("/api/user", userR);
app.use("/api/admin", adminR);
app.use("/api/auth", authR);
app.use("/api/flowchart", flowchartR);
app.use("/api/gwp", gwpRoutes);
app.use("/api/country-emission-factors", CountryemissionFactorRouter);
app.use('/api/mobile-combustion', mobileCombustionRoutes);
app.use('/api/stationary-combustion', stationaryRoutes);
app.use('/api/industrial-processes', industrialProcessRoutes);
app.use('/api/fugitive-emissions', fugitiveEmissionsRoutes);
app.use('/api/purchasedgoodsservices', purchasedgoodsservicesR);
app.use('/api/end-of-life-treatment', endOfLifeTreatmentRoutes);
app.use('/api/use-sold-products', useSoldProductsRoutes);
app.use("/api/submissions", submissionRoutes);

app.use("/api/analyse-roadmap",analyseDecarbonizationRoadmap);
app.use("/api/renewable-energy",renewableEnergyCalculate);
app.use("/api/emissions-reduction",emissionReductionSimulator);
app.use("/api", reportRoutes);
app.use("/api",emissionCalculation);
app.use("/api",userdashboardRoutes);
app.use("/api",admindashboardRoutes);
app.use("/api",governanceUploadsecSubmission);
app.use("/api",additionalDataWater);
app.use("/api",addDynamicQuestion);
// app.use("/api", griRoutes);
app.use("/api", griReportRoutes);


// app.get("/", (req, res) => {
//     res.send("Backend is running!");
// });

// Connect to Database
connectDB();

// Serve Static Files
app.use(express.static(path.join(__dirname, "build")));

// Catch-All Route
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "build", "index.html"));
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
