const User = require("../models/user");
const jwt = require("jsonwebtoken");
const  catchAsyncError = require("../middleware/catchAsyncError.js");
const ErrorHandler = require("../utils/errorhandler");
const bcrypt = require("bcrypt");
const ShortUniqueId = require("short-unique-id");
const Employer = require("../models/Employer");
const sendToken = require("../utils/jwtToken");
// const shortid = require('shortid');

exports.signup = catchAsyncError(async (req, res, next) => {
  const uid = new ShortUniqueId();
  const user = await User.findOne({
    $or: [{ email: req.body.email }, { mobile: req.body.mobile }],
  });
  if (user) {
    if (user) return next(new ErrorHandler("User Already Exist", 409));
  }

  const {
    name,
    fathername,
    age,
    gender,
    role,
    email,
    mobile,
    address,
    password,
    location,
    city,
    district,
    state,
    pincode,
    profileimg,
  } = req.body;
  const _user = await User.create({
    name,
    fathername,
    age,
    gender,
    role,
    email,
    address,
    location,
    city,
    district,
    state,
    pincode,
    hash_password: password,
    mobile,
    username: uid.stamp(32),
    profileimg,
  });
  sendToken(_user, 200, res, "Registration  is successful.");
});

exports.employerSignUp = catchAsyncError(async (req, res, next) => {
  const uid = new ShortUniqueId();
  const data = await Employer.findOne({
    $or: [{ email: req.body.email }, { mobile: req.body.mobile }],
  });

  if (data) {
    return next(new ErrorHandler("User is already registered", 409));
  }

  const {
    industryType,
    name,
    contactPerson,
    type,
    responsibilities,
    email,
    mobile,
    organization,
    password,
    country,
    location,
    city,
    benefits,
    webLink,
    profileimg,
  } = req.body;

  const _Employer = await Employer.create({
    industryType,
    name,
    contactPerson,
    type,
    responsibilities,
    email,
    mobile,
    organization,
    hash_password: password,
    country,
    location,
    city,
    benefits,
    webLink,
    username: uid.stamp(32),
    profileimg,
  });
  
  sendToken(_Employer, 200, res, "Registration  is successful.");
});

exports.signin = catchAsyncError(async (req, res, next) => {
  const { role, phone, password } = req.body;
  const Model = (role === "employee") ? User : Employer;

  const user = await Model.findOne({ mobile: phone });
  if (!user || !isPasswordMatch) {
    return next(new ErrorHandler("Invalid user or password", 400));
  }
  else{
    

  sendToken(user, 200, res, "Login Successful");
  }
});

exports.ChangePassword = catchAsyncError(async (req, res, next) => {
  const { role, phone, oldPassword, newPassword } = req.body;
  const Model = role === "employee" ? User : Employer;

  const user = await Model.findOne({ mobile: phone });

  if (!user) {
    return next(ErrorHandler("Invalid user", 400));
  }

  const isOldPasswordValid = await user.authenticate(oldPassword);
  if (!isOldPasswordValid) {
    return next(ErrorHandler("Invalid password", 400));
  }

  user.hash_password = newPassword;

  await user.save();

  sendToken(user, 200, res, "Password changed successfully");
});

