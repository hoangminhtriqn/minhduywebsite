const express = require("express");
const router = express.Router();
const serviceTypesController = require("../controllers/serviceTypesController");

// Routes cho admin quản lý service types
router.get("/", serviceTypesController.getAllServiceTypes);
router.get("/active", serviceTypesController.getActiveServiceTypes);
router.get("/:serviceTypeId", serviceTypesController.getServiceTypeById);
router.post("/", serviceTypesController.createServiceType);
router.put("/:serviceTypeId", serviceTypesController.updateServiceType);
router.delete("/:serviceTypeId", serviceTypesController.deleteServiceType);

module.exports = router;
