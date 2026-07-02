import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!);

    console.log("MongoDB connected");
  } catch (err) {
    console.error("Database connection failed");

    if (err instanceof Error) {
      console.error(err.message);
    }

    process.exit(1);
  }
};
