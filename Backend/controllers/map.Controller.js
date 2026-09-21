const { validationResult } = require("express-validator");
const mapService = require("../services/map.service");


// Get coordinates
module.exports.getCoordinates = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array(),
        });
    }

    const { address } = req.query;

    try {
        const coordinates =
            await mapService.getAddressCoordinate(address);

        res.status(200).json(coordinates);
    } catch (error) {
        res.status(404).json({
            message: "Coordinates not found",
        });
    }
};


// Get distance and time
module.exports.getDistanceTime = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array(),
        });
    }

    const { origin, destination } = req.query;

    try {
        const result = await mapService.getDistanceTime(
            origin,
            destination
        );

        res.status(200).json(result);
    } catch (error) {
        res.status(404).json({
            message: "Unable to calculate distance and time",
        });
    }
};

module.exports.getSuggestions = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array(),
        });
    }

    const { input } = req.query;

    try {
        const suggestions = await mapService.getSuggestions(input);

        res.status(200).json({
            suggestions,
        });
    } catch (error) {
        res.status(500).json({
            message: "Unable to fetch location suggestions",
        });
    }
};