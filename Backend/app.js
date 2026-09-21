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

ConnectToDb();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser());


app.use('/users', userRoutes);
app.use('/captains', captainRoutes);
app.use('/maps', mapRoutes);


module.exports = app;