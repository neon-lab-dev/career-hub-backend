const Jobs = require("../models/Jobs");
const catchAsyncError = require("../middleware/catchAsyncError");
const ErrorHandler = require("../utils/errorhandler");

exports.addJobs = catchAsyncError(async (req, res, next) => {
  const { jobs } = req.body;
  if (!jobs) {
    return next(new ErrorHandler("params education required", 400));
  }

  const {
    openingType,
    nameDepartments,
    opening,
    feeType,
    date,
    certification,
    stipend,
    description,
    jobType,
    experience,
    paidAmt,
    image,
    language,
  } = jobs;

  const newJob = await Jobs.create({
    user: req.user._id,
    openingType,
    nameDepartments,
    opening,
    feeType,
    date,
    certification,
    stipend,
    description,
    jobType,
    experience,
    paidAmt,
    image,
    language,
  });

  res.status(200).json({ newJob });
});

exports.updateJob = catchAsyncError(async (req, res, next) => {
  const { jobs } = req.body;

  if (!jobs?._id) {
    return next(new ErrorHandler('params jobs details are required', 400));
  }

  const updatedJob = await Jobs.findOneAndUpdate(
    { user: req.user._id, "_id": jobs._id },
    { $set: jobs },
    { new: true }
  );

  if (!updatedJob) {
    return next(new ErrorHandler('Job not found or not authorized', 404));
  }

  res.status(200).json({ message: "job is updated", updatedJob });
});

exports.getJobDetail = catchAsyncError(async (req, res, next) => {
  const { jobID } = req.params; 

  if (!jobID) {
    return next(new ErrorHandler("please provide job ID", 400));
  }

  const savedJob = await Jobs.findOne({ _id: jobID }).populate("user");

  if (!savedJob) {
    return next(new ErrorHandler("Job not found", 404));
  }

  res.status(200).json({ savedJob });
});

exports.getJobsList = catchAsyncError(async (req, res, next) => {
  const savedJob = await Jobs.find();

  if (!savedJob) {
    return next(new ErrorHandler("No jobs found", 404));
  }

  res.status(200).json({ savedJob });
});