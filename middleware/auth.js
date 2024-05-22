// Needs to be rewritten
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("./catchAsyncError");
const jwt = require("jsonwebtoken");
const Employer = require("../models/Employer");
const User = require("../models/user");

// checking token
exports.requireSignin = catchAsyncErrors(async (req, res, next) => {
  if (req.headers.cookie) {
    const token = req.headers.cookie.split("=")[1];
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } else {
    return next(new ErrorHandler("Login first to access this resource", 401));
  }
});

exports.employerMiddleware = catchAsyncErrors(async (req, res, next) => {
  const user = await Employer.findOne({ _id: req.user.id });
  req.user = user;
  if (!user) {
    return next(new ErrorHandler("Employer Authorization Failed", 401));
  }
  else {
    next();
  }
});

exports.userMiddleware = catchAsyncErrors(async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.user.id });
    req.user = user;
    // if(user.type !== 'employee'){
    //     return res.status(400).json({ message: 'admin Access denied' });
    // }else{
    next();
    // }
  } catch (e) {
    return next(new ErrorHandler("something went wrong ", 401));
  }
});

exports.adminMiddleware = catchAsyncErrors(async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.user.id });
    req.user = user;
    if (user.type !== "admin") {
      return next(new ErrorHandler("admin Access denied", 403));
    } else {
      next();
    }
  } catch (e) {
    return next(new ErrorHandler("something went wrong ", 401));
  }
});
