const express = require('express');
const router = express.Router();
const {getCampgrounds,getCampground,createCampground,updateCampground,deleteCampground} = require('../controllers/campgrounds');
const bookingRouter = require('./bookings');
const statusRouter = require('./status');

router.use('/:campgroundId/bookings/',bookingRouter);
router.use('/:campgroundId/status/',statusRouter);
router.route('/')
    .get(getCampgrounds)
    .post(createCampground);
router.route('/:id')
    .get(getCampground)
    .put(updateCampground)
    .delete(deleteCampground);

module.exports=router;