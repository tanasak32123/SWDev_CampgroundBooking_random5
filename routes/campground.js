const express = require("express");
const dotenv = require("dotenv");

//load env vars
dotenv.config({ path: "./config/config.env" });

//Route files
// const campgrounds = require("./routes/hospitals");
// const bookings = require("./routes/appointments");
const auth = require("./routes/auth");

const app = express();

//Body parser
app.use(express.json());

//Mount routers
// app.use("/api/v1/hospitals", hospitals);
// app.use("/api/v1/auth", auth);
// app.use("/api/v1/appointments", appointments);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(
    "Server is running in ",
    process.env.NODE_ENV,
    " mode on port ",
    PORT
  )
);

//Handle unhandled promise rejection
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  //Close server & exit process
  server.close(() => process.exit(1));
});
