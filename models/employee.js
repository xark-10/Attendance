//TODO: Add JOI to the user schema and add validation to the firstName and lastName other required fields and perform validate before saving to avoid SQL Injection.
// https://www.npmjs.com/package/joi

// Required dependencies
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { Logger } = require("logger");
const bcrypt = require("bcrypt");
require("dotenv").config();
const saltValue = 12;

// User Schema definition
var userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      require: true,
    },
    lastName: {
      type: String,
      require: true,
    },
    Age: {
        type: Number,
        require: true,
    },
    DOJ: {
        type: Date,
        require: true,
    },

    Role: {
      type: String,
    },
  },
  { collection: "Employee" }
);

module.exports = mongoose.model("User", userSchema);
