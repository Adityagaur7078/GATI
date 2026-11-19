const mongoose = require('mongoose');

async function connectToDb() {
    const configuredUri = process.env.MONGO_URI;

    if (!configuredUri) {
        throw new Error('MONGO_URI is not configured');
    }

    await mongoose.connect(configuredUri);
    console.log('Connected to configured MongoDB');
}

module.exports = connectToDb;