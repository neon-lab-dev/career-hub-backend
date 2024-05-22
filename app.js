const express = require("express");
const app = express();
const errorMiddleware = require("./middleware/error");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const cors = require("cors");
const NodeCache = require("node-cache");

//config
dotenv.config({ path: "./config/config.env" });

exports.myCache = new NodeCache();
app.use(express.json());
app.use(cookieParser());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(
  cors({
    origin: [],
    credentials: true,
    methods: ["GET", "POST", "DELETE", "PUT"],
  })
);

//import all routes
const auth = require("./routes/auth");
const employer = require("./routes/appliedJobs");
const job = require("./routes/Jobs");
const education = require("./routes/education");
const otp = require("./routes/OTP");

app.use("/api/v1", auth);
app.use("/api/v1", job);
app.use("/api/v1", employer);
app.use("/api/v1", education);
app.use("/api/v1", otp);

module.exports = app;

app.get("/", (req, res) => res.send(`<h1>working fine</h1>`));

app.get("/api/v1/getkey", (req, res) =>
  res.status(200).json({ key: process.env.RAZORPAY_API_KEY })
);

//middleware
app.use(errorMiddleware);
