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
    checkin: {
      type: Date,
    },
    time: {
      type: Number,
    },
  },
  { collection: "Checkin" }
);

module.exports = mongoose.model("Checkin", checkin);
