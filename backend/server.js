const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const hpp = require("hpp");
const rateLimit = require("express-rate-limit");

//Load env vars
dotenv.config({ path: "./config/config.env" });

//Connect to database
connectDB();

//Route files
const bookings = require("./routes/bookings");
const auth = require("./routes/auth");
const campgrounds = require("./routes/campgrounds");
const status = require('./routes/status');

const app = express();

//Enable CORS
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);

app.use(express.json());

//Sanitize data
app.use(mongoSanitize());

//Prevent XSS attacks
app.use(xss());

app.use(cookieParser());

//Set security headers
app.use(helmet());

//Rate Limiting
const limiter = rateLimit({
  windowsMs: 10 * 60 * 1000, // 10 mins
  max: 10000,
});

app.use(limiter);

//Prevent http param pollutions
app.use(hpp());

//Mount routes
app.use("/api/v5/bookings", bookings);
app.use("/api/v5/auth", auth);
app.use("/api/v5/campgrounds", campgrounds);
app.use("/api/v5/status/", status);

app.get("/", (req, res) => {
  res.status(200).json({ success: true });
});

const PORT = process.env.PORT || 8000;

const server = app.listen(
  PORT,
  console.log(
    `Server running in `,
    process.env.NODE_ENV,
    ` mode on port `,
    PORT
  )
);

//Handler unhandled promise rejections
process.on(`unhandledRejection`, (err, promise) => {
  console.log(`Error: ${err.message}`);

  //Close server & exit process
  server.close(() => process.exit(1));
});
