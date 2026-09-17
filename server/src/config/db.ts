import mongoose from 'mongoose';
import { config } from './env.js';

let memoryServerInstance: any = null;

export const connectDB = async (): Promise<void> => {
  try {
    if (config.MONGODB_URI) {
      console.log(`[Antiview DB] Attempting connection to MongoDB at: ${config.MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@')}`);
      try {
        await mongoose.connect(config.MONGODB_URI, {
          serverSelectionTimeoutMS: 4000,
        });
        console.log('✅ [Antiview DB] Connected to MongoDB database successfully.');
        return;
      } catch (err: any) {
        console.warn(`⚠️ [Antiview DB] Direct connection to MONGODB_URI failed: ${err.message}`);
        console.log('🔄 [Antiview DB] Falling back to MongoMemoryServer for zero-config demo/dev experience...');
      }
    }

    // Dynamic import MongoMemoryServer so production builds don't strictly require it if mongo is provided
    console.log('🚀 [Antiview DB] Initializing in-memory MongoDB (MongoMemoryServer)...');
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    memoryServerInstance = await MongoMemoryServer.create({
      instance: {
        launchTimeout: 120000,
      },
    });
    const uri = memoryServerInstance.getUri();

    await mongoose.connect(uri);
    console.log(`✅ [Antiview DB] MongoMemoryServer active and connected at: ${uri}`);
    console.log('💡 [Antiview DB] Running in Zero-Config Demo Mode. Data will be saved in-memory during this process.');
  } catch (error: any) {
    console.error('❌ [Antiview DB] Critical Database Connection Error:', error);
    process.exit(1);
  }
};

export const closeDB = async (): Promise<void> => {
  try {
    await mongoose.connection.close();
    if (memoryServerInstance) {
      await memoryServerInstance.stop();
    }
  } catch (err) {
    console.error('[Antiview DB] Error closing database connection:', err);
  }
};
