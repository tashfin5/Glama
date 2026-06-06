const express = require('express');
const router = express.Router();
const {
  incrementSiteViews,
  getAggregatedStats,
} = require('../controllers/statsController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(protect, admin, getAggregatedStats);
router.route('/site').post(incrementSiteViews);

module.exports = router;
