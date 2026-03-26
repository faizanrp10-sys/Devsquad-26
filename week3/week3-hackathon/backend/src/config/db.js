const mongoose = require('mongoose');

let cachedConnection = null;

const connectDB = async () => {
    if (cachedConnection) {
        return cachedConnection;
    }

    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
            family: 4 // Force IPv4
        });
        
        cachedConnection = conn;
        console.log('MongoDB Connected');
        return conn;
    } catch (err) {
        console.error('Error connecting to MongoDB:', err.message);
        throw err;
    }
};

module.exports = connectDB;
