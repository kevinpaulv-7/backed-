const mongoose = require('mongoose');

const connectDB = async () => {
    console.log('Checking MongoDB URL...');

    const MONGO_URI = process.env.mongoose;

    console.log('MongoDB URL exists:', Boolean(MONGO_URI));

    if (!MONGO_URI) {
        console.error('Error: MongoDB URL is missing!');
        process.exit(1);
    }

    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB successfully');
    } catch (err) {
        console.error('MongoDB connection failed:', err.message);
        process.exit(1);
    }
};

module.exports = connectDB;