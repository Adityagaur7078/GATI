const axios = require("axios");

// Convert address → coordinates
module.exports.getAddressCoordinate = async (address) => {
    try {
        const response = await axios.get(
            "https://nominatim.openstreetmap.org/search",
            {
                params: {
                    q: address,
                    format: "json",
                    limit: 1,
                },
                headers: {
                    "User-Agent": "GATI-Ride-Booking-App/1.0",
                },
            }
        );

        if (!response.data || response.data.length === 0) {
            throw new Error(`Location not found: ${address}`);
        }

        const location = response.data[0];

        return {
            lat: Number(location.lat),
            lng: Number(location.lon),
        };
    } catch (error) {
        console.error(
            "Geocoding error:",
            error.response?.data || error.message
        );

        throw error;
    }
};


// Get distance and duration between two locations
module.exports.getDistanceTime = async (origin, destination) => {
    try {
        // 1. Convert origin address → coordinates
        const originCoordinates =
            await module.exports.getAddressCoordinate(origin);

        // 2. Convert destination address → coordinates
        const destinationCoordinates =
            await module.exports.getAddressCoordinate(destination);

        // 3. OSRM expects:
        // longitude,latitude
        const originPoint =
            `${originCoordinates.lng},${originCoordinates.lat}`;

        const destinationPoint =
            `${destinationCoordinates.lng},${destinationCoordinates.lat}`;

        // 4. Ask OSRM for route
        const response = await axios.get(
            `https://router.project-osrm.org/route/v1/driving/${originPoint};${destinationPoint}`,
            {
                params: {
                    overview: false,
                },
            }
        );

        if (
            response.data.code !== "Ok" ||
            !response.data.routes ||
            response.data.routes.length === 0
        ) {
            throw new Error("Route not found");
        }

        const route = response.data.routes[0];

        return {
            distance: {
                meters: route.distance,
                kilometers: Number((route.distance / 1000).toFixed(2)),
            },

            duration: {
                seconds: route.duration,
                minutes: Math.round(route.duration / 60),
            },
        };
    } catch (error) {
        console.error(
            "Distance/Time error:",
            error.response?.data || error.message
        );

        throw error;
    }
};

module.exports.getSuggestions = async (input) => {
    try {
        const response = await axios.get(
            "https://nominatim.openstreetmap.org/search",
            {
                params: {
                    q: input,
                    format: "json",
                    addressdetails: 1,
                    limit: 5,
                },
                headers: {
                    "User-Agent": "GATI-Ride-Booking-App/1.0",
                },
            }
        );

        return response.data.map((place) => ({
            description: place.display_name,
            lat: Number(place.lat),
            lng: Number(place.lon),
        }));
    } catch (error) {
        console.error(
            "Suggestions error:",
            error.response?.data || error.message
        );

        throw error;
    }
};