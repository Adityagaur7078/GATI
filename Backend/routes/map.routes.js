const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");
const mapController = require("../controllers/map.Controller");

const { query } = require("express-validator");


// Address → coordinates
router.get(
    "/get-coordinates",
    query("address")
        .isString()
        .isLength({ min: 3 }),

    authMiddleware.authUser,

    mapController.getCoordinates
);


// Origin + destination → distance + time
router.get(
    "/get-distance-time",

    query("origin")
        .isString()
        .isLength({ min: 3 }),

    query("destination")
        .isString()
        .isLength({ min: 3 }),

    authMiddleware.authUser,

    mapController.getDistanceTime
);

router.get(
    "/get-suggestions",

    query("input")
        .isString()
        .isLength({ min: 3 }),

    authMiddleware.authUser,

    mapController.getSuggestions
);


module.exports = router;