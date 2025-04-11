const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  role: String,
  department: String,
  status: { type: String, enum: ["Present", "Left"], default: "Present" },
  joiningDate: Date,
  createdAt: { type: Date, default: Date.now },
});

const Employee = mongoose.model("Employee", employeeSchema);

module.exports = Employee;


