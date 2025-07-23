// Import các thư viện cần thiết
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');

// Load biến môi trường
dotenv.config();

// Khởi tạo Express app
const app = express();

// CORS configuration
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Get allowed origins from environment variable
    const allowedOriginsEnv = process.env.ALLOWED_ORIGINS || '';
    const allowedOrigins = allowedOriginsEnv.split(',').map(origin => origin.trim()).filter(origin => origin);
    
    // Default origins for development
    const defaultOrigins = [
      'http://localhost:3000',
      'http://localhost:3001', 
      'http://localhost:5173',
      'http://localhost:4173'
    ];
    
    // Combine environment origins with defaults
    const allAllowedOrigins = [...defaultOrigins, ...allowedOrigins];
    
    // Allow any Render subdomain for development/production flexibility
    const isRenderDomain = origin && (
      origin.includes('onrender.com') ||
      origin.includes('localhost') ||
      origin.includes('127.0.0.1')
    );
    
    // Log all origins for debugging
    console.log('Request origin:', origin);
    console.log('Allowed origins from env:', allowedOrigins);
    console.log('All allowed origins:', allAllowedOrigins);
    console.log('isRenderDomain:', isRenderDomain);
    
    if (allAllowedOrigins.indexOf(origin) !== -1 || isRenderDomain) {
      console.log('✅ CORS allowed for origin:', origin);
      callback(null, true);
    } else {
      console.log('❌ CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  next();
});

// MongoDB connection with retry logic
const connectWithRetry = async () => {
  const retries = 5;
  const delay = 5000;
  
  for (let i = 0; i < retries; i++) {
    try {
      await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
      });
      break;
    } catch (error) {
      if (i === retries - 1) {
        console.error('❌ Không thể kết nối MongoDB sau nhiều lần thử');
        console.error('🔍 Chi tiết lỗi:', error);
        process.exit(1);
      }
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

// Import routes
const categoryRoutes = require('./routes/categories');
const productRoutes = require('./routes/products');
const userRoutes = require('./routes/users'); // User management routes
const roleRoutes = require('./routes/roles');
const roleUserRoutes = require('./routes/roleUsers');
const favoritesRoutes = require('./routes/favorites'); // Favorites routes
const servicesApis = require('./routes/services'); // Services API
const newsEventsApis = require('./routes/newsEvents'); // News & Events API
const statisticsRoutes = require('./routes/statistics');
const businessRoutes = require('./routes/business');
const serviceRequestsRouter = require('./routes/serviceRequests');
const filesRouter = require('./routes/files');
const settingsRouter = require('./routes/settings');
const pricingRouter = require('./routes/pricing');

// Mount API routes FIRST (before Swagger)
app.use('/api/users', userRoutes); // User management routes
app.use('/api/nguoi-dung', userRoutes); // Example mount for userRoutes
app.use('/api/vai-tro', roleRoutes); // Example mount for roleRoutes
app.use('/api/nguoi-dung', roleUserRoutes); // Example mount for roleUserRoutes

// Mount category routes
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);

// Mount favorites routes
app.use('/api/yeu-thich', favoritesRoutes);
app.use('/api/dich-vu', servicesApis);
app.use('/api/news-events', newsEventsApis);
app.use('/api/thong-ke', statisticsRoutes);
app.use('/api', businessRoutes);
app.use('/api/service-requests', serviceRequestsRouter);
app.use('/api/files', filesRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/pricing', pricingRouter);

// Swagger Documentation - Mount AFTER API routes
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Test Drive Booking API Documentation'
}));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'API is running',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Xử lý lỗi 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Không tìm thấy API endpoint',
    path: req.path
  });
});

// Xử lý lỗi chung
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Đã xảy ra lỗi server',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
const PORT = process.env.PORT || 3000;

// Initialize server with database connection
const startServer = async () => {
  try {
    await connectWithRetry();
    
    app.listen(PORT, () => {
      console.log(`🚀 Server đang chạy trên port ${PORT}`);
      console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
      console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('❌ Lỗi khởi động server:', error);
    process.exit(1);
  }
};

startServer(); 