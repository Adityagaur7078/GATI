const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const userRoutes = require("./routes/user.routes");
const captainRoutes = require("./routes/captain.routes");
const mapRoutes = require("./routes/map.routes");
const rideRoutes = require("./routes/ride.routes");

const app = express();
const allowedOrigins = [
    process.env.FRONTEND_URL,
    "http://localhost:5173",
    "https://gati-tawny-tau.vercel.app",
].filter(Boolean);

// Middleware
app.use(cors({
    origin: allowedOrigins,
    credentials: true,
}));

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({
    extended: true,
    limit: "10kb",
}));
app.use(cookieParser());

// Health check
app.get("/", (req, res) => {
    res.status(200).json({
        message: "GATI backend is running",
        status: "ok",
    });
});

// Routes
app.use("/users", userRoutes);
app.use("/captains", captainRoutes);
app.use("/maps", mapRoutes);
app.use("/rides", rideRoutes);

module.exports = app;