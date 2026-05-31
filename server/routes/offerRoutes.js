const express = require('express');
const router = express.Router();
const {
  getActiveOffers,
  getAdminOffers,
  getOfferById,
  createOffer,
  updateOffer,
  deleteOffer,
} = require('../controllers/offerController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(getActiveOffers).post(protect, admin, createOffer);
router.route('/admin').get(protect, admin, getAdminOffers);
router
  .route('/:id')
  .get(getOfferById)
  .put(protect, admin, updateOffer)
  .delete(protect, admin, deleteOffer);

module.exports = router;
