import mongoose from "mongoose";
import env from "./env.js";
import asyncHandler from "../utils/asyncHandler.js";

const connectDB = asyncHandler(async () => {
    const connection = await mongoose.connect(env.MONGODB_URI);

    console.log(`MongoDB Connected: ${connection.connection.host}`);
});

export default connectDB;