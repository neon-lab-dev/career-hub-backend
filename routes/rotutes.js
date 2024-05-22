const express = require("express");
const { requireSignin, userMiddleware } = require("../com_middleware");
const { addEducation, getEducation } = require("../controllers/education");
const Router = express.Router();

Router.post("/addEducation", requireSignin, userMiddleware, addEducation);
Router.get("/getEducation", requireSignin, userMiddleware, getEducation);
//   requireSignin, userMiddleware,
module.exports = Router;
