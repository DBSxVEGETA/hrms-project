const express = require("express");
const router = express.Router();
const { getAllAttendance, getAttendanceByEmployee, markAttendance, updateAttendance } = require("../controllers/attendanceController");
const { protect } = require("../middlewares/authMiddleware");

router.get("/", protect, getAllAttendance);
router.get("/:employeeId", protect, getAttendanceByEmployee);
router.post("/", protect, markAttendance);
router.put("/:id", protect, updateAttendance);

module.exports = router;
