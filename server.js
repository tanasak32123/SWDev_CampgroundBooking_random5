const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

//Load env vars
dotenv.config({ path: "./config/config.env" });

//Connect to database
connectDB();

//Route files
const bookings = require('./routes/bookings');
const auth = require('./routes/auth');
const campgrounds = require('./routes/campgrounds');

const app = express();

app.use(express.json());

//Mount routes
app.use('/api/v5/bookings',bookings);
app.use('/api/v5/auth',auth);
app.use('/api/v5/campgrounds',campgrounds);

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

