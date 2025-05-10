const mongoose = require('mongoose');

require('dotenv').config

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        if(process.env.NODE_ENV === 'development' && typeof(process.env.NODE_ENV) !== undefined) console.log('✅ MongoDB Connected Successfully');
    } catch (error) {
        console.error('❌ MongoDB Connection Failed:', error.message);
        process.exit(1); // Stop server if DB connection fails
    }
};

module.exports = connectDB;
