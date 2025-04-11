const mongoose = require("mongoose");

const leaveSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
  reason: String,
  startDate: Date,
  endDate: Date,
  status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
  doc: String, // Path or URL
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Leave", leaveSchema);
