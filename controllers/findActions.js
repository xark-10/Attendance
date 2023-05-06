const logger = require("../config/logger.js");
const jwt = require("jsonwebtoken");
const authStringConstant = require("../constants/strings");
const User = require("../models/user");
const Employee = require("../models/employee");
const httpStatusCode = require("../constants/httpStatusCodes");

const findActions = {
  findEmployee: async function (req, res) {
    try {
      const { firstName } = req.query;
      if (!firstName) {
        return res.status(httpStatusCode.BAD_REQUEST).send({
          success: false,
          message: authStringConstant.MISSING_INPUT,
        });
      }

      const foundEmployee = await Employee.find({
        firstName: firstName,
      }).exec();

      if (foundEmployee.length === 0) {
        return res.status(httpStatusCode.BAD_REQUEST).send({
          success: false,
          message: authStringConstant.EMPLOYEE_NOTFOUND,
        });
      }

      return res.status(httpStatusCode.OK).send({
        foundEmployee: foundEmployee,
      });
    } catch (err) {
      console.log(err);
      return res.status(httpStatusCode.BAD_REQUEST).send({
        success: false,
        message: err,
      });
    }
  },
};
module.exports = findActions;
