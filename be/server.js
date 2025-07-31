// Import các thư viện cần thiết
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const swaggerUi = require("swagger-ui-express");
const swaggerSpecs = require("./config/swagger");

// Load biến môi trường
dotenv.config();

// Khởi tạo Express app
const app = express();

// CORS configuration
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      // Get allowed origins from environment variable
      const allowedOriginsEnv = process.env.ALLOWED_ORIGINS || "";
      const allowedOrigins = allowedOriginsEnv
        .split(",")
        .map((origin) => origin.trim())
        .filter((origin) => origin);

      // Combine environment origins with defaults
      const allAllowedOrigins = [...allowedOrigins];

      // Allow any Render subdomain for development/production flexibility
      const isRenderDomain =
        origin &&
        (origin.includes("onrender.com") ||
          origin.includes("localhost") ||
          origin.includes("127.0.0.1"));

      if (allAllowedOrigins.indexOf(origin) !== -1 || isRenderDomain) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

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
        process.exit(1);
      }
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};

// Import routes
const categoryRoutes = require("./routes/categories");
const productRoutes = require("./routes/products");
const userRoutes = require("./routes/users"); // User management routes
const roleRoutes = require("./routes/roles");
const roleUserRoutes = require("./routes/roleUsers");
const favoritesRoutes = require("./routes/favorites"); // Favorites routes
const servicesApis = require("./routes/services"); // Services API
const newsEventsApis = require("./routes/newsEvents"); // News & Events API


const bookingsRouter = require("./routes/bookings");
const serviceTypesRouter = require("./routes/serviceTypes");
const userServiceTypesRouter = require("./routes/userServiceTypes");
const filesRouter = require("./routes/files");
const settingsRouter = require("./routes/settings");
const pricingRouter = require("./routes/pricing");
const dashboardRouter = require("./routes/dashboard");

// Mount API routes FIRST (before Swagger)
app.use("/api/users", userRoutes); 
app.use("/api/admin/users", userRoutes);
app.use("/api/roles", roleRoutes); 
app.use("/api/role-users", roleUserRoutes); 

// Mount category routes
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);

// Mount favorites routes
app.use("/api/favorites", favoritesRoutes);
app.use("/api/services", servicesApis);
app.use("/api/news-events", newsEventsApis);


app.use("/api/bookings", bookingsRouter);
app.use("/api/service-types", serviceTypesRouter);
app.use("/api/user/service-types", userServiceTypesRouter);
app.use("/api/files", filesRouter);
app.use("/api/settings", settingsRouter);
app.use("/api/pricing", pricingRouter);
app.use("/api/dashboard", dashboardRouter);

// Swagger Documentation - Mount AFTER API routes
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpecs, {
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "Test Drive Booking API Documentation",
  })
);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "API is running",
    timestamp: new Date().toISOString(),
    database:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

// Xử lý lỗi 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Không tìm thấy API endpoint",
    path: req.path,
  });
});

// Xử lý lỗi chung
app.use((err, req, res, next) => {
  res.status(500).json({
    success: false,
    message: "Đã xảy ra lỗi server",
    error: err.message || undefined,
  });
});

// Start server
const PORT = process.env.PORT;

// Initialize server with database connection
const startServer = async () => {
  try {
    await connectWithRetry();

    const server = app.listen(PORT, () => {
      console.log(`🚀 Server đang chạy trên port ${PORT}`);
      console.log(`🔗 Server: http://localhost:${PORT}`);
      console.log(`📚 API: http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    process.exit(1);
  }
};

startServer();
