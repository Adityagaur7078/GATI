const axios = require("axios");
const captainModel = require("../models/captain.model");

const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";
const PHOTON_URL = "https://photon.komoot.io/api/";
const GEOAPIFY_URL = "https://api.geoapify.com/v1/geocode";
const GEOCODER_HEADERS = {
    "User-Agent": "GATI-Ride-Booking-App/1.0 (location search)",
};

const toSuggestion = (place) => {
    if (!place) return null;

    const lat = Number(place.lat ?? place.geometry?.coordinates?.[1]);
    const lng = Number(place.lon ?? place.geometry?.coordinates?.[0]);

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
        return null;
    }

    if (place.display_name) {
        return {
            description: place.display_name,
            lat,
            lng,
        };
    }

    const properties = place.properties || {};
    const address = [
        properties.name,
        properties.street,
        properties.city || properties.town || properties.village,
        properties.state,
        properties.country,
    ].filter(Boolean);

    return {
        description: address.join(", "),
        lat,
        lng,
    };
};

const mergeSuggestions = (...groups) => {
    const suggestions = [];
    const seen = new Set();

    groups.flat().forEach((place) => {
        const suggestion = toSuggestion(place);
        if (!suggestion) return;

        const key = `${suggestion.lat.toFixed(5)},${suggestion.lng.toFixed(5)}`;
        if (!seen.has(key)) {
            seen.add(key);
            suggestions.push(suggestion);
        }
    });

    return suggestions;
};

const getGeoapifyPlaces = async (query, endpoint = "autocomplete") => {
    if (!process.env.GEOAPIFY_API_KEY) return [];

    const response = await axios.get(`${GEOAPIFY_URL}/${endpoint}`, {
        params: {
            text: query,
            apiKey: process.env.GEOAPIFY_API_KEY,
            countrycode: "in",
            limit: 10,
            lang: "en",
        },
        headers: GEOCODER_HEADERS,
    });

    return response.data?.features || [];
};

// Convert address → coordinates
module.exports.getAddressCoordinate = async (address) => {
    try {
        const geoapifyPlaces = await getGeoapifyPlaces(address, "search");
        const geoapifySuggestion = toSuggestion(geoapifyPlaces[0]);

        if (geoapifySuggestion) {
            return geoapifySuggestion;
        }

        const response = await axios.get(
            NOMINATIM_URL,
            {
                params: {
                    q: address,
                    format: "json",
                    addressdetails: 1,
                    namedetails: 1,
                    limit: 1,
                },
                headers: GEOCODER_HEADERS,
            }
        );

        if (response.data?.length) {
            const suggestion = toSuggestion(response.data[0]);
            if (suggestion) return suggestion;
        }

        const photonResponse = await axios.get(PHOTON_URL, {
            params: { q: address, limit: 1, lang: "en" },
            headers: GEOCODER_HEADERS,
        });
        const suggestion = toSuggestion(photonResponse.data?.features?.[0]);

        if (!suggestion) throw new Error(`Location not found: ${address}`);
        return suggestion;
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
        const query = input.trim();
        const [geoapifyResponse, nominatimResponse, photonResponse] = await Promise.allSettled([
            getGeoapifyPlaces(query),
            axios.get(NOMINATIM_URL, {
                params: {
                    q: query,
                    format: "json",
                    addressdetails: 1,
                    namedetails: 1,
                    dedupe: 1,
                    limit: 8,
                },
                headers: GEOCODER_HEADERS,
            }),
            axios.get(PHOTON_URL, {
                params: { q: query, limit: 8, lang: "en" },
                headers: GEOCODER_HEADERS,
            }),
        ]);

        const geoapifyPlaces = geoapifyResponse.status === "fulfilled"
            ? geoapifyResponse.value
            : [];
        const nominatimPlaces = nominatimResponse.status === "fulfilled"
            ? nominatimResponse.value.data || []
            : [];
        const photonPlaces = photonResponse.status === "fulfilled"
            ? photonResponse.value.data?.features || []
            : [];

        return mergeSuggestions(geoapifyPlaces, nominatimPlaces, photonPlaces).slice(0, 10);
    } catch (error) {
        console.error(
            "Suggestions error:",
            error.response?.data || error.message
        );

        throw error;
    }
};

module.exports.getCaptainsInTheRadius = async (ltd, lng, radius) => {
    const captains = await captainModel.find({
        socketId: { $ne: null },
        'location.lat': { $exists: true },
        'location.lng': { $exists: true },
    });

    const earthRadiusKm = 6371;
    const toRadians = (degrees) => degrees * Math.PI / 180;

    return captains.filter((captain) => {
        const latitudeDelta = toRadians(captain.location.lat - ltd);
        const longitudeDelta = toRadians(captain.location.lng - lng);
        const latitude = toRadians(ltd);
        const captainLatitude = toRadians(captain.location.lat);
        const haversine = Math.sin(latitudeDelta / 2) ** 2
            + Math.cos(latitude) * Math.cos(captainLatitude)
            * Math.sin(longitudeDelta / 2) ** 2;
        const distance = 2 * earthRadiusKm * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));

        return distance <= radius;
    });
}