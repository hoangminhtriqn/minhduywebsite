const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./config/swagger");

// Import and configure passport for Google OAuth
const passport = require('passport');
require('./config/passport'); // Load passport configuration

// Import routes
const usersRouter = require("./routes/users");
const productsRouter = require("./routes/products");
const categoriesRouter = require("./routes/categories");
const servicesRouter = require("./routes/services");
const serviceRequestsRouter = require("./routes/serviceRequests");
const bookingsRouter = require("./routes/bookings");
const rolesRouter = require("./routes/roles");
const roleUsersRouter = require("./routes/roleUsers");
const businessRouter = require("./routes/business");
const favoritesRouter = require("./routes/favorites");
const newsEventsRouter = require("./routes/newsEvents");
const reviewsRouter = require("./routes/reviews");
const statisticsRouter = require("./routes/statistics");
const filesRouter = require("./routes/files");
const settingsRouter = require("./routes/settings");
const permissionsRouter = require("./routes/permissions");
const googleAuthRouter = require("./routes/googleAuth");

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Passport middleware
app.use(passport.initialize());

// Routes
app.use("/api/users", usersRouter);
app.use("/api/products", productsRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/services", servicesRouter);
app.use("/api/service-requests", serviceRequestsRouter);
app.use("/api/bookings", bookingsRouter);
app.use("/api/roles", rolesRouter);
app.use("/api/role-users", roleUsersRouter);
app.use("/api/business", businessRouter);
app.use("/api/favorites", favoritesRouter);
app.use("/api/news-events", newsEventsRouter);
app.use("/api/reviews", reviewsRouter);
app.use("/api/statistics", statisticsRouter);
app.use("/api/files", filesRouter);
app.use("/api/settings", settingsRouter);
app.use("/api/permissions", permissionsRouter);
app.use("/api/auth", googleAuthRouter);

// Swagger documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

module.exports = app;
