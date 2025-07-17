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
      'https://da-22062025.vercel.app',
      'https://da22062025.vercel.app',
      'https://da22062025-git-master-freeyoutube-sivicode.vercel.app',
      'https://da22062025-freeyoutube-sivicode.vercel.app',
      'https://vercel.app',
      'https://*.vercel.app',
      'https://da22062025-1.onrender.com',
      'https://*.onrender.com'
    ];
    
    // Check if origin is allowed
    if (allowedOrigins.indexOf(origin) !== -1 || origin.includes('vercel.app')) {
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

// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Kết nối MongoDB thành công');
  })
  .catch((err) => {
    console.error('❌ Lỗi kết nối MongoDB:', err);
  });

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

// Mount API routes FIRST (before Swagger)
app.use('/api/users', userRoutes); // User management routes
app.use('/api/nguoi-dung', userRoutes); // Example mount for userRoutes
app.use('/api/vai-tro', roleRoutes); // Example mount for roleRoutes
app.use('/api/nguoi-dung', roleUserRoutes); // Example mount for roleUserRoutes

// Mount category routes
app.use('/api/danh-muc', categoryRoutes);
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
    timestamp: new Date().toISOString()
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

// Khởi động server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy trên port ${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
}); 