const httpStatusCode = require("../constants/httpStatusCodes");
const Employee = require("../models/employee");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const passwordSchema = require("../validator/passwordValidator");
const authStringConstant = require("../constants/strings");
const Checkin = require("../models/checkin");
const Overtime = require("../models/overtime");
const moment = require("moment");

const checkinActions = {
  newCheckin: async function (req, res) {
    try {
      const {
        employee_id,
        check_in,
        checkin_time,
        checkout_time,
        day,
        overtime_in,
        overtime_out,
      } = req.body;
      const employeeId = req.body.employee_id;
      const employee = await Employee.findById(employeeId);
      // Convert check-in and checkout times to Date objects with just the time values
      const checkinTime = new Date(`${check_in}T${checkin_time}`);
      const checkoutTime = new Date(`${check_in}T${checkout_time}`);

      let overdiff;

      if (overtime_in && overtime_out) {
        const overTimein = new Date(`${check_in}T${overtime_in}`);
        const overTimeout = new Date(`${check_in}T${overtime_out}`);
        overdiff = moment(overTimeout).diff(moment(overTimein), "hours");
      } else {
        overdiff = 0;
      }

      // Calculate the time difference in hours between check-in and checkout times
      const diff = moment(checkoutTime).diff(moment(checkinTime), "hours");
      const workHours = diff;
      const overTimeHours = overdiff;
      let sundayCount = 0;
      if (day === "0") {
        sundayCount = 1;
      }

      // Check if there is an existing check-in for the same day
      const existingCheckin = await Checkin.findOne({
        employee: employee_id,
        check_in: check_in,
      });

      if (existingCheckin) {
        return res.status(httpStatusCode.CONFLICT).send({
          success: false,
          message: "Check-in already exists for the specified day.",
        });
      }

      // Save the check-in to the database
      const newCheckin = new Checkin({
        employee: employee_id,
        employeeName: `${employee.firstName} ${employee.lastName}`,
        check_in: check_in,
        checkin_time: checkin_time,
        checkout_time: checkout_time,
        work_hours: workHours,
        overtime_in: overtime_in,
        overtime_out: overtime_out,
        overtime_hours: overTimeHours,
        sunday_count: sundayCount,
      });

      const savedCheckin = await newCheckin.save();

      return res.status(httpStatusCode.OK).send({
        success: true,
        message: authStringConstant.CHECKIN_SUCCESSFUL,
        checkin_id: savedCheckin._id,
        work_hours: workHours,
        overtime_hours: overTimeHours,
        sunday_count: sundayCount,
      });
    } catch (err) {
      console.log(err.message);
      return res.status(httpStatusCode.CONFLICT).send({
        success: false,
        message: authStringConstant.FAILURE_BOOKING,
        error: err.message,
      });
    }
  },

  newOverTime: async function (req, res) {
    try {
      const { employee_id, overtime, hours } = req.body;
      const checkInDateFormat = moment(new Date(overtime)).format("YYYY-MM-DD");
      const checkInDate = new Date(checkInDateFormat);

      if (!employee_id && !overtime && !hours) {
        res.status(httpStatusCode.BAD_REQUEST).send({
          success: false,
          message: authStringConstant.MISSING_INPUT,
        });
      }

      const newOvertime = new Overtime({
        employee: employee_id,
        overtime: overtime,
        hours: hours,
      });

      const savedOvertime = await newOvertime.save();

      return res.status(httpStatusCode.OK).send({
        success: true,
        message: authStringConstant.CHECKIN_SUCCESSFUL,
        Overtime_id: savedOvertime._id,
      });
    } catch (err) {
      console.log(err.message);
      return res.status(httpStatusCode.CONFLICT).send({
        success: false,
        message: authStringConstant.FAILURE_BOOKING,
        error: err.message,
      });
    }
  },
};

module.exports = checkinActions;
