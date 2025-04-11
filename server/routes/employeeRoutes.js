const express = require("express");
const router = express.Router();
const employeeController = require("../controllers/employeeController");
const { protect } = require("../middlewares/authMiddleware");

router.get("/", protect, employeeController.getAllEmployees);
router.get("/:id", protect, employeeController.getEmployeeById);
router.get("/name/:name", protect, employeeController.getEmployeeByName);
router.put("/:id", protect, employeeController.updateEmployee);
router.delete("/:id", protect, employeeController.deleteEmployee);

module.exports = router;
