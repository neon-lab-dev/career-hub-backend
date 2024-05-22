const express = require("express");
const { generateOTP, verifyOTP } = require("../controllers/OtpControl");
const { otpValidationReq, otpVerifyReq, isRequestValidated } = require("../validator/auth");
const Router = express.Router();


Router.post('/generateOTP', otpValidationReq,isRequestValidated,generateOTP);
Router.post('/verifyOTP', otpVerifyReq,isRequestValidated,verifyOTP);

//   requireSignin, userMiddleware,
module.exports = Router;