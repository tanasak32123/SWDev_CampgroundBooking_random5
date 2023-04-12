const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

//Load env vars
dotenv.config({ path: "./config/config.env" });

//Connect to database
connectDB();

//Route files
const auth = require("./routes/auth");

const app = express();

app.use(express.json());

app.use(`/api/v1/auth`, auth);

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
