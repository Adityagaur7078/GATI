const dotenv = require('dotenv');
dotenv.config();  

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();
const ConnectToDb = require("./db/db");
const userRoutes = require("./routes/user.routes");
const captainRoutes = require("./routes/captain.routes");
const mapRoutes = require("./routes/map.routes");
const rideRoutes = require("./routes/ride.routes");

ConnectToDb();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser());

app.get("/", (req, res) => {
    res.status(200).json({
        message: "GATI backend is running",
        status: "ok"
    });
});

app.use('/users', userRoutes);
app.use('/captains', captainRoutes);
app.use('/maps', mapRoutes);
app.use('/rides', rideRoutes);

module.exports = app;