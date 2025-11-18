const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Connect to MongoDB using the URI from .env
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    // Optional: log full stack in development
    if (process.env.NODE_ENV === 'development') {
      console.error(error.stack);
    }
    process.exit(1); // exit process with failure
  }
};

module.exports = connectDB;
