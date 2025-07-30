const express = require("express");
const router = express.Router();
const serviceTypesController = require("../controllers/serviceTypesController");

// Route cho user lấy danh sách service types active
router.get("/", serviceTypesController.getActiveServiceTypes);

module.exports = router;
