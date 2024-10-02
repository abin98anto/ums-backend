import mongoose from "mongoose";

export const connectToMongoDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI || "mongodb://localhost:27017"
    );
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error", error);
    process.exit(1);
  }
};
