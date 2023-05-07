const logger = require("../config/logger.js");
const jwt = require("jsonwebtoken");
const authStringConstant = require("../constants/strings");
const User = require("../models/user");
const Employee = require("../models/employee");
const httpStatusCode = require("../constants/httpStatusCodes");
const moment = require("moment");
const Checkin=require("../models/checkin");
const Overtime=require("../models/overtime");
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
findCheckins: async function (req, res) {
    try {
        const employeeId = req.body.employee_id;
        const fromdate = req.body.fromdate;
        const todate = req.body.todate;

        const fromDate = new Date(moment(new Date(fromdate)).format("YYYY-MM-DD"));
        const toDate = new Date(moment(new Date(todate)).format("YYYY-MM-DD"));

        const employee = await Employee.findById(employeeId);
        if (!employee) {
            return res.status(httpStatusCode.UNAUTHORIZED).send({
                success: false,
                message: authStringConstant.USER_DOES_NOT_EXIST
            });
        }

        const checkin = await Checkin.find({
            employee: employeeId,
            "checkin": { $gte: fromDate, $lte: toDate }
        });

        return res.status(httpStatusCode.OK).send({
            checkin: checkin
        });
    } catch (err) {
        return res.status(401).send({
            err: err.message
        });
    }
},
findOvertime: async function (req, res) {
    try {
        const employeeId = req.body.employee_id;
        const fromdate = req.body.fromdate;
        const todate = req.body.todate;

        const fromDate = new Date(moment(new Date(fromdate)).format("YYYY-MM-DD"));
        const toDate = new Date(moment(new Date(todate)).format("YYYY-MM-DD"));

        const employee = await Employee.findById(employeeId);
        if (!employee) {
            return res.status(httpStatusCode.UNAUTHORIZED).send({
                success: false,
                message: authStringConstant.USER_DOES_NOT_EXIST
            });
        }

        const overtime = await Overtime.find({
            employee: employeeId,
            overtime: { $gte: fromDate, $lte: toDate }
        }).exec();

        return res.status(httpStatusCode.OK).send({
            overtime: overtime
        });
    } catch (err) {
        return res.status(401).send({
            err: err.message
        });
    }
},


};
module.exports = findActions;
