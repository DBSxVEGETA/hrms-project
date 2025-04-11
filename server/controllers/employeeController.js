const Employee = require("../models/employeeModel");

const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: "Error fetching employees", error });
  }
};

const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: "Employee not found" });
    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ message: "Error fetching employee", error });
  }
};
const getEmployeeByName = async (req, res) => {
  try {
    
    const name = req.params.name.trim();
    console.log("Searching for employee name:", name);
    const employee = await Employee.findOne({ name: new RegExp(`^${name}$`, 'i') });
    console.log("Found employee:", employee);
    
    if (!employee) return res.status(404).json({ message: "Employee not found" });
    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ message: "Error fetching employee", error });
  }
};

const updateEmployee = async (req, res) => {
  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedEmployee) return res.status(404).json({ message: "Employee not found" });
    res.status(200).json(updatedEmployee);
  } catch (error) {
    res.status(500).json({ message: "Error updating employee", error });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);
    if (!deletedEmployee) return res.status(404).json({ message: "Employee not found" });
    res.status(200).json({ message: "Employee deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting employee", error });
  }
};

module.exports = { getAllEmployees, getEmployeeById, updateEmployee, deleteEmployee , getEmployeeByName };
