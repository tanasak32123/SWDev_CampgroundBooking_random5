const express = require('express');
const {getBookings,getBooking,addBooking,updatebooking,deleteBooking} = require('../controllers/bookings')
const router = express.Router({mergeParams:true});
const {protect, authorize} = require('../middleware/auth');

router.route('/')
    .get(protect,getBookings)
    .post(protect,authorize('admin','user'),addBooking);
router.route('/:id')
    .get(protect,authorize('admin','user'),getBooking)
    .put(protect,authorize('admin','user'),updatebooking)
    .delete(protect,authorize('admin','user'),deleteBooking);

module.exports=router;