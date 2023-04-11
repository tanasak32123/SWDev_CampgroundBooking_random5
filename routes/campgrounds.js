const express = require('express');
const router = express.Router();
const {getCampgrounds,getCampground,createCampground,updateCampground,deleteCampground} = require('../controllers/campgrounds');

router.route('/').get(getCampgrounds).post(createCampground);
router.route('/:id').get(getCampground).put(updateCampground).delete(deleteCampground);

module.exports=router;