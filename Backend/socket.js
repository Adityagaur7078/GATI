const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

const userModel = require("./models/user.model");
const captainModel = require("./models/captain.model");
const rideModel = require("./models/ride.model");

let io;

const allowedOrigins = [
    process.env.FRONTEND_URL,
    "http://localhost:5173",
    "https://gati-tawny-tau.vercel.app",
].filter(Boolean);

const ACTIVE_RIDE_STATUSES = ["accepted", "ongoing"];
const USER_RIDE_STATUSES = ["pending", "accepted", "ongoing"];

/**
 * Validate geographical coordinates.
 */
function isValidLocation(location) {
    return (
        location &&
        Number.isFinite(location.lat) &&
        Number.isFinite(location.lng) &&
        location.lat >= -90 &&
        location.lat <= 90 &&
        location.lng >= -180 &&
        location.lng <= 180
    );
}

function normalizeVehicleType(vehicleType) {
    return vehicleType === "moto" ? "motorcycle" : vehicleType;
}

function getVehicleRoom(vehicleType) {
    return `captains:${normalizeVehicleType(vehicleType)}`;
}

/**
 * Extract the authenticated user's ID from a verified JWT.
 *
 * Supports common JWT payload conventions.
 */
function getTokenUserId(decoded) {
    const id = decoded?._id || decoded?.id || decoded?.userId;

    if (typeof id !== "string" || !id.trim()) {
        throw new Error("Invalid token payload");
    }

    return id;
}

/**
 * Authenticate Socket.IO connections.
 *
 * The frontend must pass its existing JWT through:
 *
 * io(url, {
 *   auth: {
 *     token: accessToken
 *   }
 * });
 */
async function authenticateSocket(socket, next) {
    try {
        const token = socket.handshake.auth?.token;

        if (!token || typeof token !== "string") {
            return next(new Error("Authentication required"));
        }

        const secret = process.env.JWT_SECRET;

        if (!secret) {
            console.error("JWT_SECRET is not configured");
            return next(new Error("Authentication unavailable"));
        }

        const decoded = jwt.verify(token, secret);
        const userId = getTokenUserId(decoded);

        // Resolve identity from trusted database records.
        // Do not trust userId or userType from a "join" event.
        const [user, captain] = await Promise.all([
            userModel.findById(userId).select("_id"),
            captainModel.findById(userId).select("_id"),
        ]);

        if (user && captain) {
            return next(new Error("Ambiguous account identity"));
        }

        if (!user && !captain) {
            return next(new Error("Account not found"));
        }

        socket.data.identity = {
            id: userId,
            type: user ? "user" : "captain",
        };

        next();
    } catch (error) {
        if (error.name !== "JsonWebTokenError" &&
            error.name !== "TokenExpiredError") {
            console.error("Socket authentication failed:", error.message);
        }

        next(new Error("Authentication failed"));
    }
}

/**
 * Register the Socket.IO server.
 */
function initializeSocket(server) {
    if (io) {
        return io;
    }

    io = new Server(server, {
        cors: {
            origin: allowedOrigins,
            methods: ["GET", "POST"],
            credentials: true,
        },
    });

    io.use(authenticateSocket);

    io.on("connection", async (socket) => {
        const { id: userId, type: userType } = socket.data.identity;

        console.log(
            `Socket connected: ${socket.id}, type: ${userType}`
        );

        const model =
            userType === "captain" ? captainModel : userModel;

        try {
            await model.findByIdAndUpdate(userId, {
                $set: { socketId: socket.id },
            });

            if (userType === "captain") {
                const captain = await captainModel.findById(userId).select("vehicle.vehicleType");
                const vehicleType = captain?.vehicle?.vehicleType;
                if (vehicleType) {
                    socket.join(getVehicleRoom(vehicleType));
                }
            }
        } catch (error) {
            console.error("Unable to register socket:", error.message);
            socket.disconnect(true);
            return;
        }

        /**
         * Keep compatibility with the existing frontend's "join" event.
         *
         * Identity comes from authentication, not event data.
         */
        socket.on("join", () => {
            socket.emit("joined", {
                status: "ok",
                userType,
            });
        });

        /**
         * Captain sends location to the user on an active ride.
         */
        socket.on("update-location-captain", async (data) => {
            if (userType !== "captain") {
                return;
            }

            const { location } = data || {};

            if (!isValidLocation(location)) {
                return;
            }

            try {
                // Persist captain position even when no ride is active, so new
                // ride searches can find nearby captains by vehicle type.
                await captainModel.findByIdAndUpdate(userId, {
                    $set: {
                        location: {
                            lat: location.lat,
                            lng: location.lng,
                        },
                    },
                });

                const ride = await rideModel.findOne({
                    captain: userId,
                    status: { $in: ACTIVE_RIDE_STATUSES },
                }).populate("user", "socketId");

                if (!ride) {
                    return;
                }

                const recipientSocketId = ride.user?.socketId;

                if (recipientSocketId) {
                    io.to(recipientSocketId).emit("captain-location", {
                        lat: location.lat,
                        lng: location.lng,
                    });
                }
            } catch (error) {
                console.error(
                    "Captain location update failed:",
                    error.message
                );
            }
        });

        /**
         * User sends location to the captain on an active ride.
         */
        socket.on("update-location-user", async (data) => {
            if (userType !== "user") {
                return;
            }

            const { location } = data || {};

            if (!isValidLocation(location)) {
                return;
            }

            try {
                const ride = await rideModel.findOne({
                    user: userId,
                    status: { $in: USER_RIDE_STATUSES },
                }).populate("captain", "socketId");

                if (!ride) {
                    return;
                }

                const recipientSocketId = ride.captain?.socketId;

                if (recipientSocketId) {
                    io.to(recipientSocketId).emit("user-location", {
                        lat: location.lat,
                        lng: location.lng,
                    });
                }
            } catch (error) {
                console.error(
                    "User location update failed:",
                    error.message
                );
            }
        });

        /**
         * Remove the stored socket ID only if this socket is still
         * the account's registered connection.
         *
         * This avoids clearing a newer connection after reconnecting.
         */
        socket.on("disconnect", async (reason) => {
            console.log(
                `Socket disconnected: ${socket.id}, reason: ${reason}`
            );

            try {
                await model.updateOne(
                    {
                        _id: userId,
                        socketId: socket.id,
                    },
                    {
                        $unset: { socketId: 1 },
                    }
                );
            } catch (error) {
                console.error(
                    "Socket cleanup failed:",
                    error.message
                );
            }
        });
    });

    return io;
}

/**
 * Emit an event to a particular socket.
 */
function sendMessageToSocketId(socketId, messageObject) {
    if (!io) {
        throw new Error("Socket has not been initialized");
    }

    if (
        typeof socketId !== "string" ||
        !socketId ||
        !messageObject ||
        typeof messageObject.event !== "string"
    ) {
        throw new Error("Invalid socket message");
    }

    io.to(socketId).emit(
        messageObject.event,
        messageObject.data
    );
}

function sendRideToVehicleType(vehicleType, messageObject) {
    if (!io) {
        throw new Error("Socket has not been initialized");
    }

    if (!vehicleType || !messageObject ||
        typeof messageObject.event !== "string") {
        throw new Error("Invalid ride broadcast");
    }

    io.to(getVehicleRoom(vehicleType)).emit(
        messageObject.event,
        messageObject.data
    );
}

module.exports = {
    initializeSocket,
    sendMessageToSocketId,
    sendRideToVehicleType,
};