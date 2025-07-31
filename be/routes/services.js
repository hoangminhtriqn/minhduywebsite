const express = require('express');
const router = express.Router();
const servicesController = require('../controllers/servicesController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .get(servicesController.getAllServices)
  .post(protect, authorize('admin'), servicesController.createService);

router.route('/:id')
  .get(servicesController.getServiceById)
  .put(protect, authorize('admin'), servicesController.updateService)
  .delete(protect, authorize('admin'), servicesController.deleteService);

module.exports = router;
