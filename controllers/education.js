const applicantEducation = require("../models/education");
const catchAsyncError = require("../middleware/catchAsyncError.js");
const ErrorHandler = require("../utils/errorhandler");

exports.addEducation = catchAsyncError(async (req, res, next) => {
  const { payload, education } = req.body;

  if (!education) {
    return next(new ErrorHandler("params education required", 400));
  }

  let updatedEducation;
  
  if (education._id) {

    updatedEducation = await applicantEducation.findOneAndUpdate(
      { user: req.user._id, "education._id": education._id },
      { $set: { "education.$": education } },
      { new: true }
    );
  } else {
    updatedEducation = await applicantEducation.findOneAndUpdate(
      { user: req.user._id },
      { $set: { education: education } },
      { new: true, upsert: true }
    );
  }

  if (!updatedEducation) {
    return next(new ErrorHandler("Education update failed", 400));
  }

  res.status(200).json({ education: updatedEducation });
});

exports.getEducation = catchAsyncError(async (req, res, next) => {
  const applicantEducationData = await applicantEducation.findOne({ user: req.user._id });

  if (!applicantEducationData) {
    return next(new ErrorHandler("Education not found", 404));
  }

  res.status(200).json({ applicantEducation: applicantEducationData });
});
