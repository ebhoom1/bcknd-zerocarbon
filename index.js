const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const bodyParser=require('body-parser');


const userR = require("./router/userR");
const adminR = require("./router/adminR");
const authR=require("./router/authR");
const flowchartR=require("./router/flowchartR");
const EmissionFactorRoute = require("./router/EmissionFactor")
const gwpRoutes = require('./router/gwpRoutes');



dotenv.config();

const app = express();

app.use(express.json());
// app.use(bodyParser.json({ limit: '50mb' }));
// app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use("/api/user", userR);
app.use("/api/admin",adminR); 
app.use("/api/auth",authR);
app.use('/api/flowchart',flowchartR); 
app.use('/api',EmissionFactorRoute)
app.use('/api/gwp',gwpRoutes);

connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`)); 
