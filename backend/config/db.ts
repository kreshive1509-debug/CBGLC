import mongoose from 'mongoose';

let isConnected = false;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri || uri.includes('YOUR_MONGODB_URI')) {
    console.warn('MONGODB_URI not set or is a placeholder.');
    return false;
  }

  if (!uri.startsWith('mongodb://') && !uri.startsWith('mongodb+srv://')) {
    console.error('MONGODB_URI has an invalid scheme. It must start with mongodb:// or mongodb+srv://');
    return false;
  }

  try {
    if (mongoose.connection.readyState === 1) {
      isConnected = true;
      return true;
    }

    console.log('Attempting to connect to MongoDB...');
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log('Connected to MongoDB successfully.');
    return true;
  } catch (error: any) {
    console.error('MongoDB connection failed');
    isConnected = false;
    return false;
  }
};

export const isMongoConnected = () => {
  return isConnected && mongoose.connection.readyState === 1;
};
