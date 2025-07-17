const express = require('express');
const router = express.Router();
const { getOrderStatistics, getUserStatistics, getProductStatistics, getTopTestDriveCars, getTestDriveRegistrationsByDate, getDashboardStatistics } = require('../controllers/statisticsController');

router.get('/lich-lai-thu', getOrderStatistics);
router.get('/nguoi-dung', getUserStatistics);
router.get('/xe', getProductStatistics);
router.get('/top-xe-lai-thu', getTopTestDriveCars);
router.get('/dang-ky-lai-thu-theo-ngay', getTestDriveRegistrationsByDate);
router.get('/dashboard', getDashboardStatistics);

module.exports = router; 