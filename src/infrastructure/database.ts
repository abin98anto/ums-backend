import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log("MogoDB connected!");
  } catch (error) {
    if (error instanceof Error) {
      console.error("Database connection error: ", error.message);
    } else {
      console.error("Unexpected error: ", error);
    }
    process.exit(1);
  }
};

export default connectDB;
