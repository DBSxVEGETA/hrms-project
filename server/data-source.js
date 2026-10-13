const mongoose = require("mongoose");

const MONGO_DATABASE_URL = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/hrms";

const connectToDatabase = async () => {
  try {
    await mongoose.connect(MONGO_DATABASE_URL);
    console.log("Database connected successfully !!");
    
  } catch (error) {
    await mongoose.disconnect();
    console.log(`Database connection failed Error:${error.message}`.red.bold);
  }
};

module.exports = { connectToDatabase };
