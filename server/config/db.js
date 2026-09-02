import mongoose from 'mongoose';

let mongoMemoryServer = null;

export const connectDB = async () => {
  // If already connected, reuse connection (essential for Vercel / serverless)
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  try {
    const mongoUri = process.env.MONGODB_URI?.trim();

    if (mongoUri) {
      try {
        console.log(`📡 Attempting connection to MongoDB at: ${mongoUri.replace(/:([^:@]{4})[^:@]*@/, ':****@')}`);
        const conn = await mongoose.connect(mongoUri, {
          serverSelectionTimeoutMS: 5000,
        });
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        return conn;
      } catch (err) {
        console.warn(`⚠️ Primary MongoDB connection failed (${err.message}).`);
        if (process.env.NODE_ENV === 'production') {
          throw err;
        }
      }
    }

    // Dev Fallback: MongoMemoryServer
    console.log('🔄 Initializing in-memory MongoDB for smooth zero-configuration development...');
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    mongoMemoryServer = await MongoMemoryServer.create();
    const memUri = mongoMemoryServer.getUri();

    const conn = await mongoose.connect(memUri);
    console.log(`✅ In-Memory MongoDB Connected: ${memUri}`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    if (process.env.NODE_ENV === 'production') {
      throw error;
    }
    process.exit(1);
  }
};

export const closeDB = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  if (mongoMemoryServer) {
    await mongoMemoryServer.stop();
  }
};
