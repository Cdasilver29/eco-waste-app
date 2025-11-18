require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const http = require('http');
const connectDB = require('./config/database');
const validateEnvironment = require('./utils/validateEnv');
const { initializeSocket } = require('./sockets');
const { chatLimiter, imageLimiter } = require('./middleware/rateLimiter');

validateEnvironment();

const app = express();
const server = http.createServer(app);

// Init WebSocket
initializeSocket(server);

// Connect DB
connectDB();

// ===== Middleware ===== //
app.use(
  helmet({
    xssFilter: true
  })
);

// ===== CORS Middleware ===== //
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:3000', 'http://localhost:5173'];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // Allow non-browser requests like Postman
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS policy: Origin ${origin} not allowed`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// No manual wildcard preflight needed — CORS middleware handles OPTIONS automatically

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ===== Safe mongoSanitize ===== //
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
    timestamp: new Date().toISOString()
  });
});

// ===== Routes ===== //
const authRoutes = require('./routes/auth');
const municipalityRoutes = require('./routes/municipalities');
const scheduleRoutes = require('./routes/schedules');
const wasteRoutes = require('./routes/waste');
const chatRoutes = require('./routes/chat');
const imageRoutes = require('./routes/image');
const mapRoutes = require('./routes/maps');
const routeRoutes = require('./routes/routes');

app.use('/api/auth', authRoutes);
app.use('/api/municipalities', municipalityRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/waste', wasteRoutes);
app.use('/api/chat', chatLimiter, chatRoutes);
app.use('/api/image', imageLimiter, imageRoutes);
app.use('/api/maps', mapRoutes);
app.use('/api/routes', routeRoutes);

// ===== 404 Handler ===== //
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ===== Error Handler ===== //
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
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















