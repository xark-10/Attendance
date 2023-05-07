const httpStatusCode = require("../constants/httpStatusCodes");
const Employee = require("../models/employee");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const passwordSchema = require("../validator/passwordValidator");
const authStringConstant = require("../constants/strings"); 
const Checkin = require("../models/checkin");
const Overtime= require("../models/overtime")
const moment = require('moment')

const checkinActions = {
  newCheckin: async function (req, res) {
    try {
      
      const { employee_id, check_in, time } = req.body;
      const checkInDateFormat = moment(new Date(check_in)).format('YYYY-MM-DD');
      const checkInDate = new Date(checkInDateFormat)

      if (!employee_id  && !check_in && !time) {
        res.status(httpStatusCode.BAD_REQUEST).send({
          success: false,
          message: authStringConstant.MISSING_INPUT
        });
      }
      
      const newCheckin = new Checkin({
        employee: employee_id,
        check_in: checkInDate,
        time: time
      });
      
      const savedCheckin = await newCheckin.save();

      return res.status(httpStatusCode.OK).send({
        success: true,
        message: authStringConstant.CHECKIN_SUCCESSFUL,
        checkin_id: savedCheckin._id
      });
          
    } catch (err) {
      console.log(err.message)
      return res.status(httpStatusCode.CONFLICT).send({
        success: false,
        message: authStringConstant.FAILURE_BOOKING,
        error: err.message
      });
    }
  },
  newOverTime: async function (req, res) {
    try {
      
      const { employee_id, overtime, hours } = req.body;
      const checkInDateFormat = moment(new Date(overtime)).format('YYYY-MM-DD');
      const checkInDate = new Date(checkInDateFormat)

      if (!employee_id  && !overtime && !hours) {
        res.status(httpStatusCode.BAD_REQUEST).send({
          success: false,
          message: authStringConstant.MISSING_INPUT
        });
      }
      
      const newOvertime = new Overtime({
        employee: employee_id,
        overtime: overtime,
        hours: hours
      });
      
      const savedOvertime = await newOvertime.save();

      return res.status(httpStatusCode.OK).send({
        success: true,
        message: authStringConstant.CHECKIN_SUCCESSFUL,
        Overtime_id: savedOvertime._id
      });
          
    } catch (err) {
      console.log(err.message)
      return res.status(httpStatusCode.CONFLICT).send({
        success: false,
        message: authStringConstant.FAILURE_BOOKING,
        error: err.message
      });
    }
  }
}

module.exports = checkinActions;
