// Required dependencies:
const httpStatusCode = require("../constants/httpStatusCodes");
const User = require("../models/user");
const Admin = require("../models/admin");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const passwordSchema = require("../validator/passwordValidator");
const authStringConstant = require("../constants/strings");
const nodemailer = require("nodemailer");
let generatedVerificationNumber;

// Authentication Controller Commands:
const authActions = {
  loginRoute: async function (req, res) {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        res.status(httpStatusCode.BAD_REQUEST).send({
          success: false,
          message: authStringConstant.MISSING_FIELDS,
        });
      }
      const user = await User.findOne({ username });
      if (!user) {
        res.status(httpStatusCode.UNAUTHORIZED).send({
          success: false,
          message: authStringConstant.USER_DOES_NOT_EXIST,
        });
      } else {
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          res.status(httpStatusCode.UNAUTHORIZED).send({
            success: false,
            message: authStringConstant.PASSWORD_INVALID,
          });
        } else {
          const accessToken = jwt.sign(
            { user_id: user._id, username },
            process.env.ACCESS_TOKEN_KEY,
            {
              expiresIn: process.env.ACCESS_TOKEN_TIME,
            }
          );

          const refreshToken = jwt.sign(
            { user_id: user._id, username },
            process.env.REFRESH_TOKEN_KEY,
            {
              expiresIn: process.env.REFRESH_TOKEN_TIME,
            }
          );
          res.status(httpStatusCode.OK).send({
            success: true,
            message: authStringConstant.SUCCESSFUL_LOGIN,
            accessToken: accessToken,
            refreshToken: refreshToken,
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  },

  registerRoute: async function (req, res) {
    try {
      const { username, password, verifyPassword, firstName, lastName, Role } =
        req.body;
      const isPasswordValid = passwordSchema.validate(password);

      if (
        !username ||
        !password ||
        !verifyPassword ||
        !firstName ||
        !lastName ||
        !Role
      ) {
        console.log(req.body);
        res.status(httpStatusCode.BAD_REQUEST).send({
          success: false,
          message: authStringConstant.MISSING_FIELDS,
        });
      } //  If the password doesn't meet the conditions returns error message
      else if (!isPasswordValid) {
        return res.status(httpStatusCode.CONFLICT).send({
          success: false,
          message: authStringConstant.PASSWORD_INVALID,
        });
      } else if (password != verifyPassword) {
        return res.status(httpStatusCode.CONFLICT).send({
          success: false,
          message: authStringConstant.PASSWORD_MISMATCH,
        });
      } else if (isPasswordValid & (password === verifyPassword)) {
        const user = await User.findOne({ username });
        if (user) {
          res.status(httpStatusCode.CONFLICT).send({
            success: false,
            message: authStringConstant.USER_EXIST,
          });
        } else {
          const newUser = new User({
            username: username,
            password: password,
            lastName: lastName,
            firstName: firstName,
            Role: Role,
          });
          await newUser.save().then(function (user) {
            if (user) {
              const accessToken = jwt.sign(
                { user_id: user._id, username },
                process.env.ACCESS_TOKEN_KEY,
                {
                  expiresIn: process.env.ACCESS_TOKEN_TIME,
                }
              );

              const refreshToken = jwt.sign(
                { user_id: user._id, username },
                process.env.REFRESH_TOKEN_KEY,
                {
                  expiresIn: process.env.REFRESH_TOKEN_TIME,
                }
              );
              res.status(httpStatusCode.CREATED).send({
                success: true,
                message: authStringConstant.SUCCESSFUL_REG,
                accessToken: accessToken,
                refreshToken: refreshToken,
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
    } catch (error) {
      console.log(error);
    }
  },
  // Ping route
  pingRoute: async function (req, res) {
    res.status(httpStatusCode.OK).send({
      success: true,
      message: authStringConstant.SUCCESSFUL_PING,
    });
  },
  renewAccessToken: async function (req, res) {
    //checks the environment and collects the data accordingly
    if (
      process.env.NODE_ENV === "development" ||
      process.env.NODE_ENV === "production"
    ) {
      var refreshToken = req.body.refreshToken;
    } else {
      var refreshToken = req.query.refreshToken;
    }
    if (!refreshToken) {
      //Token not found!
      return res.status(403).send(StringConstant.TOKEN_MISSING);
    }
    try {
      //Decode the found token and verify
      const decodedRefreshToken = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_KEY
      );
      if (decodedRefreshToken) {
        //Find the user name from the token
        const username = decodedRefreshToken.username;
        //creates new access token
        const accessToken = jwt.sign(
          { user_id: User._id, username },
          process.env.ACCESS_TOKEN_KEY,
          {
            expiresIn: process.env.ACCESS_TOKEN_TIME,
          }
        );
        return res.status(httpStatusCode.OK).send({
          success: true,
          message: StringConstant.SUCCESSFUL_TOKEN_RENEWAL,
          accessToken: accessToken,
          refreshToken: refreshToken,
        });
      } else {
        return res.status(401).send(StringConstant.INVALID_TOKEN);
      }
    } catch (err) {
      console.log(err);
      //Response for Invalid token
      return res.status(401).send(StringConstant.UNKNOWN_ERROR);
    }
  },

  // Unidentified route
  errorPageRoute: function (req, res) {
    res.status(httpStatusCode.NOT_FOUND).json({
      success: "false",
      message: StringConstant.PAGE_NOT_FOUND,
    });
  },
  registerAdmin: async function (req, res) {
    try {
      const { adminUsername, adminPassword, verifyAdminPassword } = req.body;
      const isAdminPasswordValid = passwordSchema.validate(adminPassword);

      if (!adminUsername || !adminPassword || !verifyAdminPassword) {
        console.log(req.body);
        res.status(httpStatusCode.BAD_REQUEST).send({
          success: false,
          message: authStringConstant.MISSING_FIELDS,
        });
      } //  If the adminPassword doesn't meet the conditions returns error message
      else if (!isAdminPasswordValid) {
        return res.status(httpStatusCode.CONFLICT).send({
          success: false,
          message: authStringConstant.PASSWORD_INVALID,
        });
      } else if (adminPassword != verifyAdminPassword) {
        return res.status(httpStatusCode.CONFLICT).send({
          success: false,
          message: authStringConstant.PASSWORD_MISMATCH,
        });
      } else if (
        isAdminPasswordValid &
        (adminPassword === verifyAdminPassword)
      ) {
        const admin = await Admin.findOne({ adminUsername });
        if (admin) {
          res.status(httpStatusCode.CONFLICT).send({
            success: false,
            message: authStringConstant.USER_EXIST,
          });
        } else {
          const newAdmin = new Admin({
            adminUsername: adminUsername,
            adminPassword: adminPassword,
          });
          await newAdmin.save().then(function (admin) {
            if (admin) {
              const accessToken = jwt.sign(
                { user_id: admin._id, adminUsername },
                process.env.ACCESS_TOKEN_KEY,
                {
                  expiresIn: process.env.ACCESS_TOKEN_TIME,
                }
              );

              const refreshToken = jwt.sign(
                { user_id: admin._id, adminUsername },
                process.env.REFRESH_TOKEN_KEY,
                {
                  expiresIn: process.env.REFRESH_TOKEN_TIME,
                }
              );
              res.status(httpStatusCode.CREATED).send({
                success: true,
                message: authStringConstant.SUCCESSFUL_REG,
                accessToken: accessToken,
                refreshToken: refreshToken,
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
    } catch (error) {
      console.log(error);
    }
  },
  adminLoginRoute: async function (req, res) {
    try {
      const { adminUsername, adminPassword } = req.body;
      if (!adminUsername || !adminPassword) {
        res.status(httpStatusCode.BAD_REQUEST).send({
          success: false,
          message: authStringConstant.MISSING_FIELDS,
        });
      }
      const admin = await Admin.findOne({ adminUsername });
      if (!admin) {
        res.status(httpStatusCode.UNAUTHORIZED).send({
          success: false,
          message: authStringConstant.USER_DOES_NOT_EXIST,
        });
      } else {
        const isAdminPasswordValid = await bcrypt.compare(
          adminPassword,
          admin.adminPassword
        );
        if (!isAdminPasswordValid) {
          res.status(httpStatusCode.UNAUTHORIZED).send({
            success: false,
            message: authStringConstant.PASSWORD_INVALID,
          });
        } else {
          const accessToken = jwt.sign(
            { user_id: admin._id, adminUsername },
            process.env.ACCESS_TOKEN_KEY,
            {
              expiresIn: process.env.ACCESS_TOKEN_TIME,
            }
          );

          const refreshToken = jwt.sign(
            { user_id: admin._id, adminUsername },
            process.env.REFRESH_TOKEN_KEY,
            {
              expiresIn: process.env.REFRESH_TOKEN_TIME,
            }
          );
          res.status(httpStatusCode.OK).send({
            success: true,
            message: authStringConstant.SUCCESSFUL_LOGIN,
            accessToken: accessToken,
            refreshToken: refreshToken,
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  },

  generateAndSendVerificationNumber: async function (req, res) {
    try {
      // Generate a random 6-digit number
      generatedVerificationNumber = Math.floor(100000 + Math.random() * 900000);
      // Create a Nodemailer transport
      const transporter = nodemailer.createTransport({
        service: "Gmail", // e.g., Gmail, Outlook, etc.
        auth: {
          user: process.env.GMAILID,
          pass: process.env.GMAILPASSWD,
        },
      });

      // Email options
      const mailOptions = {
        from: process.env.GMAILID,
        to: "sridevipwdc@gmail.com",
        subject: "Verification Code",
        text: `Your verification code is: ${generatedVerificationNumber}`,
      };

      // Send email
      const info = await transporter.sendMail(mailOptions);

      return res.send({
        success: true,
        message: "Email sent",
      });
    } catch (error) {
      return res.status(httpStatusCode.CONFLICT).send({
        success: false,
        message: "Error sending email",
        error: error.message,
      });
    }
  },

  verifyVerificationCode: async function (req, res) {
    const { verificationCode } = req.body;

    // Parse the verification code as an integer
    const parsedVerificationCode = parseInt(verificationCode, 10);

    // Compare the verification code with the stored generated code
    if (parsedVerificationCode === generatedVerificationNumber) {
      return res.send({
        success: true,
        message: "Verification code is valid",
      });
    } else {
      return res.status(httpStatusCode.CONFLICT).send({
        success: false,
        message: "Verification code is invalid",
      });
    }
  },
};

module.exports = authActions;
