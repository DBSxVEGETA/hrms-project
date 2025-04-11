const express = require("express");
const router = express.Router();
const { applyLeave, getAllLeaves, getLeavesByEmployee, updateLeaveStatus } = require("../controllers/leaveController");
const { protect } = require("../middlewares/authMiddleware");

router.post("/", protect, applyLeave);
router.get("/", protect, getAllLeaves);
router.get("/:employeeId", protect, getLeavesByEmployee);
router.put("/:id", protect, updateLeaveStatus);

module.exports = router;
