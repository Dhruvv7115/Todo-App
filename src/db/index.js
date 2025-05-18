import mongoose from "mongoose";
const DB_NAME = "Todo-App";

async function connectDB(){
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );

    console.log(
      ` \n MongoDB connected ! DB Host : ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("Mongoose Connection Failed :( ", error);
    process.exit(1);
  }
};

export default connectDB;