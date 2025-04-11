const Leave = require("../models/leaveModel");

const applyLeave = async (req, res) => {
  const { employee, reason, startDate, endDate, doc } = req.body;

  try {
    const leave = new Leave({ employee, reason, startDate, endDate, doc });
    await leave.save();
    res.status(201).json(leave);
  } catch (error) {
    res.status(500).json({ message: "Error applying for leave", error });
  }
};

const getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find().populate("employee");
    res.status(200).json(leaves);
  } catch (error) {
    res.status(500).json({ message: "Error fetching leaves", error });
  }
};

const getLeavesByEmployee = async (req, res) => {
  try {
    const leaves = await Leave.find({ employee: req.params.employeeId });
    res.status(200).json(leaves);
  } catch (error) {
    res.status(500).json({ message: "Error fetching leaves for employee", error });
  }
};

const updateLeaveStatus = async (req, res) => {
  const { status } = req.body;
  try {
    const leave = await Leave.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!leave) return res.status(404).json({ message: "Leave not found" });

    res.status(200).json(leave);
  } catch (error) {
    res.status(500).json({ message: "Error updating leave status", error });
  }
};

module.exports = {
  applyLeave,
  getAllLeaves,
  getLeavesByEmployee,
  updateLeaveStatus,
};
