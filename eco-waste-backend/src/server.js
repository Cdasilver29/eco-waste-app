require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const http = require('http');
const path = require('path');
const connectDB = require('./config/database');
const validateEnvironment = require('./utils/validateEnv');
const { initializeSocket } = require('./sockets');
const { chatLimiter, imageLimiter } = require('./middleware/rateLimiter');

validateEnvironment();

const app = express();
const server = http.createServer(app);

// ===== WebSocket ===== //
initializeSocket(server);

// ===== Connect DB ===== //
connectDB();

// ===== Security ===== //
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// ===== CORS Middleware ===== //
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:3000', 'http://localhost:5173'];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) callback(null, true);
      else callback(new Error(`CORS policy: Origin ${origin} not allowed`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// ===== Safe pre-flight ===== //
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Origin', allowedOrigins.join(','));
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    return res.sendStatus(200);
  }
  next();
});

// ===== Request Parsing ===== //
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ===== Sanitize ===== //
app.use((req, res, next) => {
  try {
    if (req.body) mongoSanitize.sanitize(req.body);
    if (req.params) mongoSanitize.sanitize(req.params);
  } catch (err) {
    console.error('Sanitize error', err);
  }
  next();
});

// ===== Health Check ===== //
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Eco Waste API is running',
    timestamp: new Date().toISOString(),
  });
});

// ===== API Routes ===== //
app.use('/api/auth', require('./routes/auth'));
app.use('/api/municipalities', require('./routes/municipalities'));
app.use('/api/schedules', require('./routes/schedules'));
app.use('/api/waste', require('./routes/waste'));
app.use('/api/chat', chatLimiter, require('./routes/chat'));
app.use('/api/image', imageLimiter, require('./routes/image'));
app.use('/api/maps', require('./routes/maps'));
app.use('/api/routes', require('./routes/routes'));

// ===== Serve React/Vite Frontend ===== //
const frontendPath = path.join(__dirname, '..', 'client', 'build'); // adjust path if needed
app.use(express.static(frontendPath));

// Catch-all for SPA routes (non-API)
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// ===== 404 for unmatched API routes (regex-safe) ===== //
app.all(/^\/api\/.*$/, (req, res) => {
  res.status(404).json({ error: 'API route not found' });
});

// ===== Error Handler ===== //
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  });
});

// ===== Start Server ===== //
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log('WebSocket ready for real-time tracking');
});

module.exports = app;

















