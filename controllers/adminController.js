// Required dependencies:
const httpStatusCode = require("../constants/httpStatusCodes");
const Employee = require("../models/employee");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const passwordSchema = require("../validator/passwordValidator");
const authStringConstant = require("../constants/strings"); 




const adminActions = {
    addEmployee: async function (req, res) {
        const {firstName, lastName, Role, Age, DOJ } =
        req.body;

        if(
            !Age ||
            !DOJ ||
            !firstName || 
            !lastName ||
            !Role
          ) {
            console.log(req.body);
            res.status(httpStatusCode.BAD_REQUEST).send({
              success: false,
              message: authStringConstant.MISSING_FIELDS,
            });
        } 


        else{
            const newEmployee = new Employee({
                Age: Age,
                DOJ: DOJ,
                lastName: lastName,
                firstName: firstName,
                Role: Role,
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
    }
}
module.exports = adminActions;
