const mongoose = require("mongoose");

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      autoIndex: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000
    });
    
    console.log("✅ MongoDB Connected Successfully");
    
    mongoose.connection.on("error", (err) => {
      console.error("❌ MongoDB Error:", err.message);
    });
    
    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️ MongoDB Disconnected");
    });
    
    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      console.log("🛑 MongoDB Connection Closed");
      process.exit(0);
    });
    
  } catch (err) {
    console.error("❌ Database Connection Failed");
    throw err;
  }
}

module.exports = connectDB;