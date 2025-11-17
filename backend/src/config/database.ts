import mongoose from 'mongoose';

export const connectDatabase = async (): Promise<void> => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-crypto-advisor';

  if (!process.env.MONGODB_URI) {
    console.warn('⚠️  MONGODB_URI not set, using default local MongoDB');
  }

  try {
    await mongoose.connect(mongoUri, {
      // MongoDB Atlas connection options
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    });
    
    console.log('✅ Connected to MongoDB');
    console.log(`   Database: ${mongoose.connection.name}`);
    console.log(`   Host: ${mongoose.connection.host}`);
  } catch (error: any) {
    console.error('❌ MongoDB connection error:', error.message);
    
    if (error.name === 'MongoServerSelectionError') {
      console.error('   → Check your MongoDB Atlas connection string');
      console.error('   → Verify your IP address is whitelisted in MongoDB Atlas');
      console.error('   → Check your username and password are correct');
    }
    
    throw error;
  }
};

// TODO: Add graceful disconnect handler
export const disconnectDatabase = async (): Promise<void> => {
  await mongoose.disconnect();
  console.log('Disconnected from MongoDB');
};

