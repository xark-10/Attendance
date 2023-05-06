const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { Logger } = require("logger");
require("dotenv").config();

// User Schema definition
var overtime = new mongoose.Schema(
  {
    employee: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
    },
    overtime: {
      type: Date,
    },
    hours: {
      type: Number,
    },
  },
  { collection: "Overtime" }
);

module.exports = mongoose.model("Overtime", overtime);
