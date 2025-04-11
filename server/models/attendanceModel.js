const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
  date: { type: Date, required: true },
  task: { type: String },
  status: { type: String, enum: ["Present", "Absent", "Leave"], default: "Present" },
  position: { type: String },
  department: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const Attendance = mongoose.model("Attendance", attendanceSchema);

module.exports = Attendance;
