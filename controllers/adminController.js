// Required dependencies:
const httpStatusCode = require("../constants/httpStatusCodes");
const Employee = require("../models/employee");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const passwordSchema = require("../validator/passwordValidator");
const authStringConstant = require("../constants/strings");

const adminActions = {
  addEmployee: async function (req, res) {
    const {
      firstName,
      lastName,
      Role,
      Age,
      DOJ,
      description,
      address,
      emergencyContact,
      panNumber,
    } = req.body;

    if (
      !Age ||
      !DOJ ||
      !firstName ||
      !lastName ||
      !Role ||
      !description ||
      !address ||
      !emergencyContact ||
      !panNumber
    ) {
      console.log(req.body);
      res.status(httpStatusCode.BAD_REQUEST).send({
        success: false,
        message: authStringConstant.MISSING_FIELDS,
      });
    } else {
      const newEmployee = new Employee({
        Age: Age,
        DOJ: DOJ,
        lastName: lastName,
        firstName: firstName,
        Role: Role,
        description: description,
        address: address,
        emergency_contact: emergencyContact,
        PAN: panNumber,
      });
      await newEmployee.save().then(function (user) {
        if (newEmployee) {
          res.status(httpStatusCode.CREATED).send({
            success: true,
            message: authStringConstant.SUCCESSFUL_REG,
          });
        } else {
          return res.status(httpStatusCode.CONFLICT).send({
            success: false,
            message: authStringConstant.FAILURE_REG,
            error: err.message,
          });
        }
      });
    }
  },
  deleteEmployee: async function (req, res) {
    try {
      const id = req.params.id;

      const removedEmployee = await Employee.findByIdAndDelete(id);

      if (!removedEmployee) {
        res.status(404).json({ error: "Employee record not found" });
      } else {
        res.json({ message: "Employee record deleted successfully" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to delete employee record" });
    }
  },
};
module.exports = adminActions;
