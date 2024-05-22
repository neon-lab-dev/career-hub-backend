const express = require("express");
const { requireSignin, userMiddleware, employerMiddleware } = require("../middleware/auth");
const { addJobs, getJobsList, updateJob, getJobDetail } = require("../controllers/Jobs");
const Router = express.Router();


Router.post('/addJobs', requireSignin, employerMiddleware, addJobs);
Router.put('/updateJob', requireSignin, employerMiddleware, updateJob);
Router.get('/getJobDetail/:jobID', getJobDetail);
Router.get('/getJobsList', getJobsList);

//   requireSignin, userMiddleware,
module.exports = Router;