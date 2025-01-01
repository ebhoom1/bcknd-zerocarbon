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

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
    origin: ["http://localhost:3000", "http://13.232.145.124"],
    credentials: true,
}));

// Routes
app.use("/api/user", userR);
app.use("/api/admin", adminR);
app.use("/api/auth", authR);
app.use("/api/flowchart", flowchartR);
app.use("/api", EmissionFactorRoute);
app.use("/api/gwp", gwpRoutes);
app.use("/api/fuelCombustion", fuelCombustionRoutes);
app.use("/api/country-emission-factors", CountryemissionFactorRouter);

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
