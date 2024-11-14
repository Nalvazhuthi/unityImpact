import mongoose from "mongoose";

let connectDB = () => {
  try {
    mongoose.connect(process.env.MONGO_URl);
    console.log("Db connected");
  } catch (error) {
    process.exit(1);
  }
};

export default connectDB;
