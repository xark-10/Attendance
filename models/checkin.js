const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { Logger } = require("logger");
require("dotenv").config();

// User Schema definition
var checkin = new mongoose.Schema(
  {
    employee: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
    },
    employeeName: {
      type: String,
      required: true,
    },
    check_in: {
      type: Date,
      required: true,
    },
    checkin_time: {
      type: String,
      required: true,
    },
    checkout_time: {
      type: String,
      required: true,
    },
    work_hours: {
      type: Number,
      default: 0,
    },
    sunday_count: {
      type: Number,
      default: 0,
    },
    overtime_in: {
      type: String,
    },
    overtime_out: {
      type: String,
    },
    overtime_hours: {
      type: Number,
      default: 0,
    },
  },
  { collection: "Checkin" }
);

module.exports = mongoose.model("Checkin", checkin);
