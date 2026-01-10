import mongoose from 'mongoose';
import { DB_NAME } from '../constant.js';
import dotenv from 'dotenv';
dotenv.config();

const connectToDB = async () => {
  try {
    const connectToInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    console.log(`\n MongoDB Connected on host : ${connectToInstance.connection.host}`);
  } catch (error) {
    console.log('MONGODB CONNECTION FAILD', error);
    process.exit(1);
  }
};

export default connectToDB;
