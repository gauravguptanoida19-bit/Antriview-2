import { connectDB, closeDB } from '../config/db.js';
import { SeedService } from '../services/seedService.js';

const runSeed = async () => {
  try {
    await connectDB();
    await SeedService.seedDemoData();
    console.log('✅ [Seed Runner] Database seeding completed successfully.');
    await closeDB();
    process.exit(0);
  } catch (error) {
    console.error('❌ [Seed Runner] Error during seeding:', error);
    process.exit(1);
  }
};

runSeed();
