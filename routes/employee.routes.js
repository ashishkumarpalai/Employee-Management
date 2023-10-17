const express = require("express")
const { authenticate } = require("../middleware/auth.middleware");
const { EmployeeModel } = require("../models/employee.model")

const employeeRouter = express.Router()


// Create a new employee
employeeRouter.post('/employees', async (req, res) => {
    try {
        const { firstName, lastName, email, department, salary } = req.body;

        // Check if an employee with the provided email already exists
        const existingEmployee = await EmployeeModel.findOne({ email });
        if (existingEmployee) {
            return res.status(400).send({ "msg": "Employee with the same Email already exists." })
        }

        const newEmployee = new EmployeeModel({
            firstName,
            lastName,
            email,
            department,
            salary,
        });

        const savedEmployee = await newEmployee.save();
        res.status(201).send({ "msg": "Employee data added successfully", employee: savedEmployee });
    } catch (error) {
        res.status(400).send({ msg: "Internal server error", error: error.message });
    }
});

// Get all employees with pagination
employeeRouter.get('/employees', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    try {
        const employees = await EmployeeModel.find()
            .skip(skip)
            .limit(limit)
            .exec();
        res.json(employees);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Unable to fetch employees' });
    }
});

// Update an employee
employeeRouter.put('/employees/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const Employee = await EmployeeModel.findById(id);
        if (!Employee) {
            return res.status(404).json({ message: "Employee not found" });
        }
        const updatedEmployee = await EmployeeModel.findByIdAndUpdate(id, req.body, { new: true });

        res.send({ msg: "Employee details updated", updated: updatedEmployee });
    } catch (error) {
        console.error(error);
        res.status(500).send({ msg: "Internal server error", error: error.message });
    }
});

// Delete an employee
employeeRouter.delete('/employees/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deleteEmployee = await EmployeeModel.findByIdAndRemove(id);
        if (!deleteEmployee) {
            return res.status(404).send({ msg: "Employee not found" });
        }
        // res.send({ msg: "Employee Deleted ", error: error.message });
        res.status(200).json({ msg: 'Employee removed successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ msg: "Internal server error", error: 'Unable to delete the employee' });
    }
});

// Search employees by first name
employeeRouter.get('/employees/search', async (req, res) => {
    const { firstName } = req.query;
    try {
        const employees = await EmployeeModel.find({ firstName: { $regex: new RegExp(firstName, 'i') } });
        res.json(employees);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Unable to search employees' });
    }
});

employeeRouter.get('/employees/filter', async (req, res) => {
    const { department } = req.query;
    try {
        const employees = await EmployeeModel.find({ department });
        res.json(employees);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Unable to filter employees by department' });
    }
});

employeeRouter.get('/employees/sort/:order', async (req, res) => {
    const { order } = req.params;
  
    try {
      let sortDirection = 1; // Default to ascending order
  
      if (order === 'desc') {
        sortDirection = -1; // Change to descending order
      }
  
      const employees = await EmployeeModel.find().sort({ salary: sortDirection }).exec();
      res.json(employees);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Unable to sort employees by salary' });
    }
  });
  

module.exports = { employeeRouter }