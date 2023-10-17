const mongoose = require('mongoose');

// Define the Employee schema
const employeeSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    department: {
        type: String,
        enum: ['Tech', 'Marketing', 'Operations'],
        required: true,
    },
    salary: {
        type: Number,
        required: true,
    },
});

// Create the Employee model
const EmployeeModel = mongoose.model('employee', employeeSchema);

module.exports = { EmployeeModel };
