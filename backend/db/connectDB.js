import mongoose from "mongoose";

let connectDB = () => {
  
  try {
    mongoose.connect(process.env.MONGO_URl);
    
  } catch (error) {
    
    process.exit(1);
  }
};

export default connectDB;
