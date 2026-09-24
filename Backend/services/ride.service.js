const crypto = require('crypto');
const rideModel = require('../models/ride.model');
const mapService = require('./map.service');


const FARE_CONFIG = {
    moto: {
        baseFare: 20,
        perKm: 8,
        perMinute: 1,
    },

    auto: {
        baseFare: 30,
        perKm: 10,
        perMinute: 1.5,
    },

    car: {
        baseFare: 50,
        perKm: 14,
        perMinute: 2,
    },
};


module.exports.createRide = async ({
    user,
    pickup,
    destination,
    vehicleType,
    pickupLocation,
    destinationLocation,
}) => {

    // 1. Validate input
    if (!pickup || !destination) {
        throw new Error('Pickup and destination are required');
    }

    if (!vehicleType) {
        throw new Error('Vehicle type is required');
    }

    // 2. Calculate fare
    const fare = await getFare(
        pickup,
        destination,
        vehicleType
    );

    // 3. Create ride
    const ride = await rideModel.create({
        user,
        pickup,
        destination,
        vehicleType,
        pickupLocation,
        destinationLocation,
        otp: getOtp(4),
        fare: fare.totalFare,
    });

    return ride;
};

async function getFare(pickup, destination, vehicleType) {

    // Validate locations
    if (!pickup || !destination) {
        throw new Error('Pickup and destination are required');
    }

    // Validate vehicle
    if (!FARE_CONFIG[vehicleType]) {
        throw new Error('Invalid vehicle type');
    }

    // Get distance + duration from OSRM
    const distanceTime = await mapService.getDistanceTime(
        pickup,
        destination
    );

    const distanceInKm = distanceTime.distance.kilometers;
    const durationInMinutes = distanceTime.duration.minutes;

    const config = FARE_CONFIG[vehicleType];

    // Calculate fare
    const distanceFare =
        distanceInKm * config.perKm;

    const timeFare =
        durationInMinutes * config.perMinute;

    const totalFare =
        config.baseFare +
        distanceFare +
        timeFare;

    return {
        vehicleType,

        baseFare: config.baseFare,

        distance: distanceInKm,

        duration: formatDuration(durationInMinutes),

        distanceFare: Number(distanceFare.toFixed(2)),

        timeFare: Number(timeFare.toFixed(2)),

        totalFare: Number(totalFare.toFixed(2)),
    };
}

module.exports.getFare = getFare;

module.exports.acceptRide = async ({ rideId, captainId }) => {
    const ride = await rideModel.findOneAndUpdate(
        { _id: rideId, status: 'pending' },
        { status: 'accepted', captain: captainId },
        { new: true }
    );

    if (!ride) {
        throw new Error('Ride is no longer available');
    }

    return ride.populate('user captain');
};

module.exports.confirmRide = async ({ rideId, captainId, otp }) => {
    const ride = await rideModel.findOne({ _id: rideId, captain: captainId, status: 'accepted' }).select('+otp');

    if (!ride) {
        throw new Error('Ride is no longer available');
    }

    if (ride.otp !== otp) {
        throw new Error('Invalid ride OTP');
    }

    ride.status = 'ongoing';
    await ride.save();

    return rideModel.findById(ride._id)
        .select('+otp')
        .populate('user')
        .populate('captain');
};

module.exports.completeRide = async ({ rideId, captainId }) => {
    const ride = await rideModel.findOneAndUpdate(
        { _id: rideId, captain: captainId, status: 'ongoing' },
        { status: 'completed' },
        { new: true }
    ).populate('user captain');

    if (!ride) {
        throw new Error('Ride is not active or was already completed');
    }

    return ride;
};

function formatDuration(minutes) {
    if (minutes < 60) {
        return `${minutes} mins`;
    }

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    return remainingMinutes === 0
        ? `${hours} hr`
        : `${hours} hr ${remainingMinutes} mins`;
}

function getOtp(num) {
    function generateOtp(num) {
        const otp = crypto.randomInt(Math.pow(10, num - 1), Math.pow(10, num)).toString();
        return otp;
    }

    return generateOtp(num);
}