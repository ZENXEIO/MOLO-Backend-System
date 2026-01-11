import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const connectToDB = async () => {
  try {
    const raw = process.env.MONGODB_URI || '';

    if (!/^mongodb(\+srv)?:\/\//i.test(raw)) {
      throw new Error('Invalid MONGODB_URI: must start with "mongodb://" or "mongodb+srv://"');
    }

    const cleaned = raw.replace(/\/+$|\/+$/g, '').replace(/\/+$/g, '');

    const hasDb = /mongodb(\+srv)?:\/\/[^\/]+\/.+/.test(cleaned);

    const dbName = process.env.MONGODB_DB || 'DATABASE_MOLO';
    const uri = hasDb ? cleaned : `${cleaned}/${dbName}`;

    // Mask credentials for console logging
    const safeUri = uri.replace(/(mongodb(\+srv)?:\/\/)([^@]+@)/i, '$1****@');

    const connectToInstance = await mongoose.connect(uri);

    console.log(`\nMongoDB Connected on host : ${connectToInstance.connection.host}`);
  } catch (error) {
    console.log('MONGODB CONNECTION FAILD', error);
    process.exit(1);
  }
};

export default connectToDB;
