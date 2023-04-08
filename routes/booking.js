const express = require('express');
const {getBookings} = require('../controllers/booking')
const router = express.Router();

router.route('/').get(getBookings);


module.exports=router;