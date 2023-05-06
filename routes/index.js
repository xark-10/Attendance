const express = require('express')
const router = express.Router()
const authActions = require('../controllers/authController')
const adminActions = require('../controllers/adminController')

// const auth = require("../middleware/auth");
const app = express();



router.get("/", authActions.pingRoute);
router.post("/registerUser", authActions.registerRoute);
router.post("/loginUser", authActions.loginRoute);
router.post("/renewAccessToken", authActions.renewAccessToken);
router.post("/createEployee", adminActions.addEmployee);



module.exports = router
