const axios = require("axios");
const captainModel = require("../models/captain.model");

const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";
const PHOTON_URL = "https://photon.komoot.io/api/";
const GEOCODER_HEADERS = {
    "User-Agent": "GATI-Ride-Booking-App/1.0 (location search)",
};

const toSuggestion = (place) => {
    if (!place) return null;

    const lat = Number(place.lat ?? place.geometry?.coordinates?.[1]);
    const lng = Number(place.lon ?? place.geometry?.coordinates?.[0]);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

    if (place.display_name) {
        return { description: place.display_name, lat, lng };
    }

    const properties = place.properties || {};
    const description = [
        properties.name,
        properties.street,
        properties.city || properties.town || properties.village,
        properties.state,
        properties.country,
    ].filter(Boolean).join(", ");

    return description ? { description, lat, lng } : null;
};

module.exports.getAddressCoordinate = async (address) => {
    const response = await axios.get(NOMINATIM_URL, {
        params: { q: address, format: "json", addressdetails: 1, limit: 1 },
        headers: GEOCODER_HEADERS,
    });

    const suggestion = toSuggestion(response.data?.[0]);
    if (!suggestion) throw new Error(`Location not found: ${address}`);
    return suggestion;
};

module.exports.getDistanceTime = async (origin, destination) => {
    const originCoordinates = await module.exports.getAddressCoordinate(origin);
    const destinationCoordinates = await module.exports.getAddressCoordinate(destination);
    const originPoint = `${originCoordinates.lng},${originCoordinates.lat}`;
    const destinationPoint = `${destinationCoordinates.lng},${destinationCoordinates.lat}`;

    const response = await axios.get(
        `https://router.project-osrm.org/route/v1/driving/${originPoint};${destinationPoint}`,
        { params: { overview: false } },
    );

    if (response.data.code !== "Ok" || !response.data.routes?.length) {
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
};

module.exports.getSuggestions = async (input) => {
    const [nominatim, photon] = await Promise.allSettled([
        axios.get(NOMINATIM_URL, {
            params: {
                q: input.trim(),
                format: "json",
                addressdetails: 1,
                namedetails: 1,
                limit: 8,
                countrycodes: "in",
            },
            headers: GEOCODER_HEADERS,
        }),
        axios.get(PHOTON_URL, {
            params: { q: input.trim(), limit: 8, lang: "en" },
            headers: GEOCODER_HEADERS,
        }),
    ]);

    const nominatimPlaces = nominatim.status === "fulfilled" ? nominatim.value.data || [] : [];
    const photonPlaces = photon.status === "fulfilled" ? photon.value.data?.features || [] : [];
    const suggestions = [];
    const seen = new Set();

    [...nominatimPlaces, ...photonPlaces].forEach((place) => {
        const suggestion = toSuggestion(place);
        if (!suggestion) return;

        const key = `${suggestion.lat.toFixed(5)},${suggestion.lng.toFixed(5)}`;
        if (!seen.has(key)) {
            seen.add(key);
            suggestions.push(suggestion);
        }
    });

    return suggestions.slice(0, 10);
};

module.exports.getCaptainsInTheRadius = async (ltd, lng, radius, vehicleType) => {
    const normalizedVehicleType = vehicleType === "moto" ? "motorcycle" : vehicleType;
    const captains = await captainModel.find({
        socketId: { $ne: null },
        "location.lat": { $exists: true },
        "location.lng": { $exists: true },
        ...(normalizedVehicleType ? { "vehicle.vehicleType": normalizedVehicleType } : {}),
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
};
