const express = require('express');
const {getStatus,getAverage, getRecommendation} = require('../controllers/status')
const router = express.Router({mergeParams:true});

router.route('/:date').get(getStatus);
router.route('/average/:dayNumber').get(getAverage);
router.route('/').get(getRecommendation);

module.exports=router;