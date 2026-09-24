const rideService = require("../services/ride.service");
const { validationResult } = require('express-validator');
const mapService = require("../services/map.service");
const { sendMessageToSocketId } = require("../socket");
const rideModel = require("../models/ride.model");
const captainModel = require("../models/captain.model");

module.exports.createRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { pickup, destination, vehicleType } = req.body;

    try {
        const pickupCoordinates = await mapService.getAddressCoordinate(pickup);
        const destinationCoordinates = await mapService.getAddressCoordinate(destination);
        const ride = await rideService.createRide({
            user: req.user._id,
            pickup,
            destination,
            vehicleType,
            pickupLocation: pickupCoordinates,
            destinationLocation: destinationCoordinates,
        });

        let captainsInRadius = await mapService.getCaptainsInTheRadius(pickupCoordinates.lat, pickupCoordinates.lng, 2);

        if (captainsInRadius.length === 0) {
            captainsInRadius = await captainModel.find({ socketId: { $ne: null } });
        }

        const rideWithUser = await rideModel.findById(ride._id).populate('user');
        const userRide = await rideModel.findById(ride._id).select('+otp').populate('user');
        const captainRide = rideWithUser.toObject();
        delete captainRide.otp;

        captainsInRadius.forEach(captain => {
            sendMessageToSocketId(captain.socketId, {
                event: 'new-ride',
                data: captainRide
            })

        });

        return res.status(201).json(userRide);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

}

module.exports.getFare = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { pickup, destination, vehicleType } = req.query;

    try {
        const fare = await rideService.getFare(pickup, destination, vehicleType);
        return res.status(200).json(fare);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

module.exports.acceptRide = async (req, res) => {
    const { rideId } = req.body;

    if (!rideId) {
        return res.status(400).json({ message: 'Ride ID is required' });
    }

    try {
        const ride = await rideService.acceptRide({
            rideId,
            captainId: req.captain._id,
        });

        return res.status(200).json(ride);
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
};

module.exports.confirmRide = async (req, res) => {
    const { rideId, otp } = req.body;

    if (!rideId || !/^\d{4}$/.test(otp || '')) {
        return res.status(400).json({ message: 'Ride ID and a 4-digit OTP are required' });
    }

    try {
        const ride = await rideService.confirmRide({
            rideId,
            captainId: req.captain._id,
            otp,
        });
        const rideData = ride.toObject();
        const userOtp = rideData.otp;
        delete rideData.otp;

        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-confirmed',
            data: { ...rideData, otp: userOtp },
        });

        return res.status(200).json(rideData);
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
};

module.exports.completeRide = async (req, res) => {
    const { rideId } = req.body;

    if (!rideId) {
        return res.status(400).json({ message: 'Ride ID is required' });
    }

    try {
        const ride = await rideService.completeRide({
            rideId,
            captainId: req.captain._id,
        });

        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-completed',
            data: { rideId: ride._id },
        });

        return res.status(200).json({ message: 'Ride completed', ride });
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
};