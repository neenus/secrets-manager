import mongoose from "mongoose";
import ErrorResponse from "@utils/errorResponse";

// connect to mongodb
export const connectDB = async () => {
  const MONGO_URI = process.env.NODE_ENV === 'production' ? process.env.MONGO_URI_PROD : process.env.MONGO_URI_DEV;
  try {
    const connection = await mongoose.connect(MONGO_URI as string, {});
    console.log(`Connected to MongoDB at ${connection.connection.host}:${connection.connection.port}`);
  } catch (error) {
    if (error instanceof Error) {
      throw new ErrorResponse(`${error.message}`, 500);
    } else {
      throw new ErrorResponse('Error: Unknown error', 500);
    }
    process.exit(1);
  }
}

export default connectDB;