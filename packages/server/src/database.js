import mongoose from "mongoose";

const mongoURI = process.env.MONGODB_URI;

let connection;

(async () => {
  try {
    console.log(`🚧   Connecting to MongoDB on ${mongoURI}`);
    connection = await mongoose.connect(mongoURI);
    console.log("✅   Connected to MongoDB");
  } catch (error) {
    console.error("❌   MongoDB connection error:\n", error);
    process.exit(1);
  }
})();

export default connection;
