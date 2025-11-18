// src/utils/validateEnv.js

function validateEnvironment() {
  const requiredVars = [
    'MONGODB_URI',      // MongoDB connection string
    'NODE_ENV',       // development, production, etc.
    'PORT',           // server port
    'JWT_SECRET'      // secret key for auth tokens
  ];

  const missing = requiredVars.filter(v => !process.env[v]);

  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:', missing.join(', '));
    process.exit(1); // Stop the app if env vars are missing
  }

  console.log('✅ Environment variables validated successfully');
}

module.exports = validateEnvironment;
