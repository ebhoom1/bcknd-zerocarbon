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
const EmissionFactorRoute = require("./router/EmissionFactor");
const gwpRoutes = require("./router/gwpRoutes");
const fuelCombustionRoutes = require("./router/fuelCombustionRoutes");
const CountryemissionFactorRouter = require("./router/countryemissionFactorRouter");
const mobileCombustionRoutes = require('./router/mobileCombustionRoutes');
const industrialProcessRoutes = require('./router/industrialProcessRoutes');
const fugitiveEmissionsRoutes=require('./router/fugitiveEmissionsRoutes');
const endOfLifeTreatmentRoutes = require('./router/endOfLifeTreatmentRoutes');
const purchasedgoodsservicesR=require('./router/purchasedgoodsservicesR');
const useSoldProductsRoutes = require('./router/useSoldProductsRoutes');


const CalculationDataOfEmissionC02eRouter = require("./router/CalculationDataOfEmissionC02eRoute");
const CalculateEmissionCO2eRouter = require("./router/CalculateEmissionCO2eRoute");
const TotalEmissionCO2eControllerRouter = require("./router/TotalEmissionCO2eControllerRoute");

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
    origin: ["http://localhost:3000","http://15.207.14.226","https://api.esg.ebhoom.com","https://esg.ebhoom.com"],
    credentials: true,
}));
// app.use(cors({
//     origin: ["http://localhost:3000", "https://api.zerohero.ebhoom.com", "https://zerotohero.ebhoom.com"],
//     credentials: true,
// }));

// Routes
app.use("/api/user", userR);
app.use("/api/admin", adminR);
app.use("/api/auth", authR);
app.use("/api/flowchart", flowchartR);
app.use("/api", EmissionFactorRoute);
app.use("/api/gwp", gwpRoutes);
app.use("/api/fuelCombustion", fuelCombustionRoutes);
app.use("/api/country-emission-factors", CountryemissionFactorRouter);
app.use('/api/mobile-combustion', mobileCombustionRoutes);
app.use('/api/industrial-processes', industrialProcessRoutes);
app.use('/api/fugitive-emissions', fugitiveEmissionsRoutes);
app.use('/api/purchasedgoodsservices', purchasedgoodsservicesR);
app.use('/api/end-of-life-treatment', endOfLifeTreatmentRoutes);
app.use('/api/use-sold-products', useSoldProductsRoutes);


app.use("/api", CalculationDataOfEmissionC02eRouter);
app.use("/api", CalculateEmissionCO2eRouter);
app.use("/api", TotalEmissionCO2eControllerRouter);

app.get("/", (req, res) => {
    res.send("Backend is running!");
});

// Connect to Database
connectDB();

// // Serve Static Files
// app.use(express.static(path.join(__dirname, "build")));

// // Catch-All Route
// app.get("*", (req, res) => {
//     res.sendFile(path.join(__dirname, "build", "index.html"));
// });

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
