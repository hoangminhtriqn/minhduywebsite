const express = require('express');
const router = express.Router();
const { getDashboard } = require('../controllers/dashboardController');
const { auth } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   - name: Dashboard
 *     description: Dashboard statistics endpoints
 */

/**
 * @swagger
 * /api/dashboard:
 *   get:
 *     summary: Get dashboard statistics
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     userStats:
 *                       type: object
 *                       properties:
 *                         totalUsers:
 *                           type: number
 *                           example: 150
 *                         adminCount:
 *                           type: number
 *                           example: 5
 *                         userCount:
 *                           type: number
 *                           example: 145
 *                     serviceRequestStats:
 *                       type: object
 *                       properties:
 *                         totalRequests:
 *                           type: number
 *                           example: 50
 *                         pendingRequests:
 *                           type: number
 *                           example: 10
 *                         confirmedRequests:
 *                           type: number
 *                           example: 15
 *                         completedRequests:
 *                           type: number
 *                           example: 20
 *                         cancelledRequests:
 *                           type: number
 *                           example: 5
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

// Get dashboard statistics
router.get('/', auth, getDashboard);

module.exports = router; 