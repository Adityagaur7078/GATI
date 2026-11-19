const mongoose = require('mongoose');

async function connectToDb() {
    if (!process.env.MONGO_URI) {
        throw new Error('MONGO_URI is not configured');
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');
}

module.exports = connectToDb;