const express = require('express');
const {getBookings,getBooking,addBooking,updatebooking,deleteBooking} = require('../controllers/bookings')
const router = express.Router({mergeParams:true});

// fake authorization for testing
const fakeAuth = (req,res,next)=>{
    req.user = {
        id:'643525c350eca24920c13714',
        role:'admin'
    };
    next();
};

router.route('/').get(fakeAuth,getBookings).post(fakeAuth,addBooking);
router.route('/:id').get(fakeAuth,getBooking).put(fakeAuth,updatebooking).delete(fakeAuth,deleteBooking);

module.exports=router;