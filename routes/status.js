const express = require('express');
const {getStatus,getAverage} = require('../controllers/status')
const router = express.Router({mergeParams:true});

router.route('/:date').get(fakeAuth,getStatus);
router.route('/average/:dayNumber').get(getAverage);

module.exports=router;