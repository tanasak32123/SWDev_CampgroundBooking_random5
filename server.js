const express = require('express');
const dotenv = require('dotenv');
// const cookieParser=require('cookie-parser');
const connectDB = require('./config/db');
// const cors = require('cors');
// const mongoSanitize = require('express-mongo-sanitize');
// const helmet = require('helmet')
// const xss = require('xss-clean');
// const rateLimit = require('express-rate-limit');
// const hpp = require('hpp');
// const swaggerJsDoc = require('swagger-jsdoc');
// const swaggerUI = require('swagger-ui-express');

dotenv.config({path:'./config/config.env'});

connectDB();

const booking = require('./routes/booking');

const app = express();
app.use(express.json());
// app.use(cookieParser());
// app.use(mongoSanitize());
// app.use(helmet());
// app.use(xss());
// app.use(limiter);
// app.use(hpp());
// app.use(cors());

app.use('/api/v5/booking',booking);

const PORT = process.env.PORT || 500;
const server = app.listen(PORT, console.log('Server running in', process.env.NODE_ENV, ' mode on port ', PORT));

process.on('unhandledRejection',(err,promise)=>{
    console.log(`Error; ${err.message}`);
    server.close(()=>process.exit(1));
});