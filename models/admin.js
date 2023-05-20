//TODO: Add JOI to the admin schema and add validation to the firstName and lastName other required fields and perform validate before saving to avoid SQL Injection.
// https://www.npmjs.com/package/joi

// Required dependencies
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { Logger } = require("logger");
const bcrypt = require("bcrypt");
require("dotenv").config();
const saltValue = 12;

// User Schema definition
var adminSchema = new mongoose.Schema(
  {
    adminUsername: {
      type: String,
      lowercase: true,
      trim: true,
      require: true,
      unique: true,
      minlength: 6,
    },
    adminPassword: {
      type: String,
    },
    accessToken: {
      type: String,
    },
    refreshToken: {
      type: String,
    },
  },
  { collection: "Admin" }
);

adminSchema.pre("save", function (next) {
  var admin = this;
  if (this.isModified("adminPassword") || this.isNew) {
    bcrypt.genSalt(saltValue, function (err, salt) {
      if (err) {
        return next(err);
      }
      bcrypt.hash(admin.adminPassword, salt, function (err, hash) {
        if (err) {
          return next(err);
        }
        admin.adminPassword = hash;
        next();
      });
    });
  } else {
    return next();
    //logger.error('error', `User Model - Returning User`)
  }
});

module.exports = mongoose.model("Admin", adminSchema);
