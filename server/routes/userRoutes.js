const express = require('express');
const router = express.Router();
const {
  loginUser,
  registerUser,
  loginAdmin,
  getUserProfile,
  updateUserProfile,
  toggleWishlist,
  getUsers,
  deleteUser,
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(protect, admin, getUsers);
router.route('/:id').delete(protect, admin, deleteUser);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/admin-login', loginAdmin);
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);
router.route('/wishlist').post(protect, toggleWishlist);

module.exports = router;
