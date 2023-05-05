const express = require("express");
const {protect, authorize} = require('../middleware/auth');
const {
  getStatus,
  getAverage,
  getRecommendation,
} = require("../controllers/status");
const router = express.Router({ mergeParams: true });

router.route("/:date").get(getStatus);
router.route("/average/:dayNumber").get(protect,authorize('admin'), getAverage);
router.route("/").get(getRecommendation);

module.exports = router;
