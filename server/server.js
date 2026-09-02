import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import { connectDB } from './config/db.js';
import { Admin } from './models/Admin.js';
import { seedDatabase } from './scripts/seed.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // 1. Connect to Database
    await connectDB();

    // 2. Auto-seed if database is empty
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      console.log('📦 Database appears empty. Running initial seed...');
      await seedDatabase();
    }

    // 3. Start Express Server
    const server = app.listen(PORT, () => {
      console.log(`🚀 College Memories Server is running on port ${PORT} [${process.env.NODE_ENV || 'development'} mode]`);
      console.log(`🌐 API Base URL: http://localhost:${PORT}/api`);
    });

    // Graceful Shutdown
    const shutdown = () => {
      console.log('\n🛑 Shutting down server gracefully...');
      server.close(() => {
        console.log('⚡ Server closed.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (error) {
    console.error(`❌ Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();
