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

// CORS configuration - Allow specific origins
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:3000', 
      'http://localhost:3001',
      process.env.FRONTEND_URL,
      'https://*.onrender.com',
      'https://minhduywebsite.onrender.com'
    ].filter(Boolean); // Remove undefined values
    
    // Check if origin is allowed
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Origin', 'Accept'],
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware log request (tạm thời để debug)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - Origin: ${req.headers.origin}`);
  next();
});

// Hàm kết nối MongoDB với retry logic
const connectDB = async (retries = 5, delay = 5000) => {
  for (let i = 0; i < retries; i++) {
    try {
      console.log(`🔄 Thử kết nối MongoDB lần ${i + 1}/${retries}...`);
      await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
      });
      console.log('✅ Kết nối MongoDB thành công');
      return true;
    } catch (err) {
      console.error(`❌ Lỗi kết nối MongoDB lần ${i + 1}:`, err.message);
      if (i === retries - 1) {
        console.error('❌ Không thể kết nối MongoDB sau nhiều lần thử');
        return false;
      }
      console.log(`⏳ Chờ ${delay/1000}s trước khi thử lại...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  return false;
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
const testDriveOrdersRouter = require('./routes/testDriveOrders');
const filesRouter = require('./routes/files');
const settingsRouter = require('./routes/settings');

// Mount API routes FIRST (before Swagger)
app.use('/api/users', userRoutes); // User management routes
app.use('/api/nguoi-dung', userRoutes); // Example mount for userRoutes
app.use('/api/vai-tro', roleRoutes); // Example mount for roleRoutes
app.use('/api/nguoi-dung', roleUserRoutes); // Example mount for roleUserRoutes

// Mount category routes
app.use('/api/categories', categoryRoutes);
app.use('/api/xe', productRoutes);

// Mount favorites routes
app.use('/api/yeu-thich', favoritesRoutes);
app.use('/api/dich-vu', servicesApis);
app.use('/api/tin-tuc-su-kien', newsEventsApis);
app.use('/api/thong-ke', statisticsRoutes);
app.use('/api', businessRoutes);
app.use('/api/service-requests', serviceRequestsRouter);
app.use('/api/test-drive-orders', testDriveOrdersRouter);
app.use('/api/files', filesRouter);
app.use('/api/settings', settingsRouter);

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

// Khởi động server với kết nối database
const startServer = async () => {
  try {
    // Kết nối database trước
    const dbConnected = await connectDB();
    if (!dbConnected) {
      console.error('❌ Không thể kết nối database, thoát ứng dụng');
      process.exit(1);
    }

    // Khởi động server
    const PORT = process.env.PORT || 3000;
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

// Khởi động ứng dụng
startServer(); 