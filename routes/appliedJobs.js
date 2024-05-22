const express = require("express");
const {
  requireSignin,
  userMiddleware,
  employerMiddleware,
} = require("../middleware/auth");

const {
  appliedJobs,
  getAppliedJobs,
  getCreatedJobs,
  getUserListAppliedJob,
} = require("../controllers/appliedJobs");

const Router = express.Router();

Router.post("/appliedJob", requireSignin, userMiddleware, appliedJobs);
Router.get("/getAppliedJobs", requireSignin, userMiddleware, getAppliedJobs);
Router.get(
  "/getCreatedJobs",
  requireSignin,
  employerMiddleware,
  getCreatedJobs
);
Router.get(
  "/getUserListAppliedJob",
  requireSignin,
  employerMiddleware,
  getUserListAppliedJob
);

module.exports = Router;
