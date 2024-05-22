const appliedJobs = require("../models/appliedJobs");
const Jobs = require("../models/Jobs");
const catchAsyncError = require("../middleware/catchAsyncError");
const ErrorHandler = require("../utils/errorhandler");

function runUpdate(condition, updateData) {
  return new Promise((resolve, reject) => {
    appliedJobs
      .findOneAndUpdate(condition, updateData, { upsert: true })
      .then((result) => resolve(result))
      .catch((err) => reject(err));
  });
}

exports.appliedJobs = catchAsyncError(async (req, res, next) => {
  const appliedJob = await appliedJobs.findOne({ user: req.user._id });

  if (appliedJob) {
    let promiseArray = [];
    let alreadyApplied = false;

    req.body.applied.forEach((applied) => {
      const job = applied.job;
      const item = appliedJob.applied.find((c) => c.job == job);

      if (item) {
        alreadyApplied = true;
      } else {
        const condition = { user: req.user._id };
        const update = {
          $push: {
            applied: applied,
          },
        };
        promiseArray.push(runUpdate(condition, update));
      }
    });

    if (alreadyApplied) {
      return res.status(200).json({ message: "You have already applied" });
    } else {
      await Promise.all(promiseArray);
      res.status(200).json({ message: "Jobs applied successfully" });
    }
  } else {
    const newAppliedJob = new appliedJobs({
      user: req.user._id,
      applied: req.body.applied,
    });

    const savedJob = await newAppliedJob.save();
    res.status(200).json({ savedJob });
  }
});

exports.getAppliedJobs = catchAsyncError(async (req, res, next) => {
  const appliedJob = await appliedJobs.findOne({ user: req.user._id }).populate("applied.job");

  if (!appliedJob) {
    return next(new ErrorHandler("No applied jobs found", 404));
  }

  const jobsData = appliedJob.applied.map((item) => ({
    _id: item.job._id.toString(),
    openingType: item.job.openingType,
    nameDepartments: item.job.nameDepartments,
    opening: item.job.opening,
    feeType: item.job.feeType,
    date: item.job.date,
    certification: item.job.certification,
    paidAmt: item.job.paidAmt,
    stipend: item.job.stipend,
    jobType: item.job.jobType,
    language: item.job.language,
    description: item.job.description,
    experience: item.job.experience,
    status: item.status,
  }));

  res.status(200).json({ jobs: jobsData });
});

exports.getCreatedJobs = catchAsyncError(async (req, res, next) => {
  const jobs = await Jobs.find({ user: req.user._id });

  if (!jobs.length) {
    return next(new ErrorHandler("No jobs found", 404));
  }

  res.status(200).json({ jobs });
});

exports.getUserListAppliedJob = catchAsyncError(async (req, res, next) => {
  const { jobID } = req.params;

  if (!jobID) {
    return next(new ErrorHandler("jobID is not available", 400));
  }

  const jobs = await appliedJobs
    .find({ applied: { $elemMatch: { job: jobID } } }, { user: 1 })
    .populate("user")
    .lean();

  if (!jobs.length) {
    return next(new ErrorHandler("No users found for the given job ID", 404));
  }

  const userList = jobs.map((item) => item.user);
  res.status(200).json({ userList });
});
