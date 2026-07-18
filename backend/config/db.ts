import mongoose from 'mongoose';

let isConnected = false;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri || uri.includes('YOUR_MONGODB_URI')) {
    console.warn('⚠️ MONGODB_URI not set or is a placeholder. Operating in local JSON fallback mode.');
    return false;
  }

  // Validate scheme to avoid MongoParseError
  if (!uri.startsWith('mongodb://') && !uri.startsWith('mongodb+srv://')) {
    console.error('❌ MONGODB_URI has an invalid scheme. It must start with mongodb:// or mongodb+srv://');
    return false;
  }

  try {
    if (mongoose.connection.readyState === 1) {
      isConnected = true;
      return true;
    }

    console.log('🔄 Attempting to connect to MongoDB...');
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    });
    isConnected = true;
    console.log('✅ Connected to MongoDB successfully.');
    return true;
  } catch (error: any) {
    console.error('❌ Failed to connect to MongoDB:', error.message);
    if (error.name === 'MongoParseError') {
      console.error('👉 Tip: Check if your MONGODB_URI is correctly formatted.');
    } else if (error.name === 'MongoServerSelectionError') {
      console.error('👉 Tip: Ensure your MongoDB Atlas IP whitelist allows connections from all (0.0.0.0/0) or this environment.');
    }
    isConnected = false;
    return false;
  }
};

export const isMongoConnected = () => {
  return isConnected && mongoose.connection.readyState === 1;
};
