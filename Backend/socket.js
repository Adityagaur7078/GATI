const socketIo = require('socket.io');
const captainModel = require("./models/captain.model");
const userModel = require("./models/user.model");

let io;

function initializeSocket(server) {
    io = socketIo(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
        }
    });

    io.on('connection', (socket) => {
        console.log(`Client connected: ${socket.id}`);

        socket.on('join', async (data) => {
            const { userId, userType } = data;

            try {
                let updatedDocument;

                if (userType === 'user') {
                    updatedDocument = await userModel.findByIdAndUpdate(
                        userId,
                        { socketId: socket.id },
                        { new: true }
                    );
                } else if (userType === 'captain') {
                    updatedDocument = await captainModel.findByIdAndUpdate(
                        userId,
                        { socketId: socket.id },
                        { new: true }
                    );
                }

                if (!updatedDocument) {
                    console.error(`Unable to update socket ID for ${userType}: ${userId}`);
                }
            } catch (error) {
                console.error(`Unable to update socket ID for ${userType}:`, error.message);
            }
        });

        socket.on('update-location-captain', async (data) => {
            const { userId, location } = data || {};

            if (!userId || !location || !Number.isFinite(location.lat) || !Number.isFinite(location.lng)) {
                return;
            }

            try {
                await captainModel.findByIdAndUpdate(userId, {
                    location: {
                        lat: location.lat,
                        lng: location.lng
                    }
                });
                const ride = await require('./models/ride.model').findOne({
                    captain: userId,
                    status: { $in: ['accepted', 'ongoing'] },
                }).populate('user');

                if (ride?.user?.socketId) {
                    io.to(ride.user.socketId).emit('captain-location', {
                        lat: location.lat,
                        lng: location.lng,
                    });
                }
            } catch (error) {
                console.error(`Unable to update captain location for ${userId}:`, error.message);
            }
        });

        socket.on('update-location-user', async (data) => {
            const { userId, location } = data || {};

            if (!userId || !location || !Number.isFinite(location.lat) || !Number.isFinite(location.lng)) {
                return;
            }

            try {
                const ride = await require('./models/ride.model').findOne({
                    user: userId,
                    status: { $in: ['pending', 'accepted', 'ongoing'] },
                }).populate('captain');

                if (ride?.captain?.socketId) {
                    io.to(ride.captain.socketId).emit('user-location', {
                        lat: location.lat,
                        lng: location.lng,
                    });
                }
            } catch (error) {
                console.error(`Unable to relay user location for ${userId}:`, error.message);
            }
        });

        socket.on('disconnect', () => {
            console.log(`Client disconnected: ${socket.id}`);
        });
    });

    return io;
}

function sendMessageToSocketId(socketId, messageObject) {
    if (!io) {
        throw new Error('Socket has not been initialized');
    }

    io.to(socketId).emit(messageObject.event, messageObject.data);
}

module.exports = { initializeSocket, sendMessageToSocketId };