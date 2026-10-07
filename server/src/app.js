const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const env = require('./config/env');
const { errorHandler, AppError } = require('./middleware/error.middleware');

const authRoutes = require('./routes/auth.routes');
const spaceRoutes = require('./routes/space.routes');
const testimonialRoutes = require('./routes/testimonial.routes');
const publicRoutes = require('./routes/public.routes');
const analyticsRoutes = require('./routes/analytics.routes');

const app = express();

// Parse CLIENT_URL environment variable into allowed origins list
const allowedOrigins = (env.clientUrl || 'http://localhost:5173')
  .split(',')
  .map(url => url.trim().replace(/\/$/, ''))
  .filter(Boolean);

// Strict CORS configuration with credentials enabled
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no Origin header (e.g., server-to-server, curl, Postman, health checks)
    if (!origin) {
      return callback(null, true);
    }

    const normalizedOrigin = origin.replace(/\/$/, '');
    if (allowedOrigins.includes(normalizedOrigin)) {
      return callback(null, true);
    } else {
      return callback(null, false); // Reject disallowed origins
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Static uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    env: env.nodeEnv
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/spaces', spaceRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/analytics', analyticsRoutes);

// Handle unknown API routes
app.all('/api/*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Centralized error handling
app.use(errorHandler);

module.exports = app;
