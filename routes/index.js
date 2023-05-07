const express = require("express");
const router = express.Router();
const authActions = require("../controllers/authController");
const adminActions = require("../controllers/adminController");
const findActions = require("../controllers/findActions");
const checkinActions = require("../controllers/checkinController");
// const auth = require("../middleware/auth");
const app = express();

router.get("/", authActions.pingRoute);
router.post("/registerUser", authActions.registerRoute);
router.post("/loginUser", authActions.loginRoute);
router.post("/renewAccessToken", authActions.renewAccessToken);
router.post("/createEmployee", adminActions.addEmployee);
router.get("/findEmployees", findActions.findEmployee);
router.post("/checkin", checkinActions.newCheckin);
router.post("/overtime",checkinActions.newOverTime)
module.exports = router;
