const express = require('express');
const {getBookings,getBooking,addBooking,updatebooking,deleteBooking} = require('../controllers/bookings')
const router = express.Router();

// fake authorization for testing
const fakeAuth = (req,res,next)=>{
    req.user = {
        id:'1',
        role:'admin'
    };
    next();
};

router.route('/').get(fakeAuth,getBookings).post(fakeAuth,addBooking);
router.route('/:id').get(fakeAuth,getBooking).put(fakeAuth,updatebooking).delete(fakeAuth,deleteBooking);

module.exports=router;