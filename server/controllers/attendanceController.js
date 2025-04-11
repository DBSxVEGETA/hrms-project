const Attendance = require("../models/attendanceModel");

const getAllAttendance = async (req, res) => {
  try {
    const records = await Attendance.find().populate("employee");
    res.status(200).json(records);
  } catch (error) {
    console.error("Error in getAllAttendance:", error);
    res.status(500).json({ message: "Error fetching attendance records", error });
  }
};

const getAttendanceByEmployee = async (req, res) => {
  try {
    const records = await Attendance.find({ employee: req.params.employeeId });
    res.status(200).json(records);
  } catch (error) {
    console.error("Error in getAttendanceByEmployee:", error);
    res.status(500).json({ message: "Error fetching attendance", error });
  }
};

const markAttendance = async (req, res) => {
  const { employee, date, status, task, position, department } = req.body;

  try {
    const existing = await Attendance.findOne({ employee, date });
    if (existing) {
      return res.status(400).json({ message: "Attendance already marked for this date" });
    }

    const newRecord = new Attendance({
      employee,
      date,
      status,
      task,
      position,
      department,
    });

    await newRecord.save();
    res.status(201).json(newRecord);
  } catch (error) {
    console.error("Error in markAttendance:", error);
    res.status(500).json({ message: "Error marking attendance", error });
  }
};

const updateAttendance = async (req, res) => {
  try {
    const updated = await Attendance.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Attendance record not found" });

    res.status(200).json(updated);
  } catch (error) {
    console.error("Error in updateAttendance:", error);
    res.status(500).json({ message: "Error updating attendance", error });
  }
};

module.exports = {
  getAllAttendance,
  getAttendanceByEmployee,
  markAttendance,
  updateAttendance,
};
