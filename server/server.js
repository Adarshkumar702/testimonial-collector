const app = require('./src/app');
const connectDB = require('./src/config/db');
const env = require('./src/config/env');

const startServer = async () => {
  try {
    await connectDB();
    
    app.listen(env.port, () => {
      console.log(`[Server] Running on port ${env.port} in ${env.nodeEnv} mode`);
      console.log(`[Server] API Health check available at http://localhost:${env.port}/api/health`);
    });
  } catch (error) {
    console.error(`[Server Error] Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();
