const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallbacksecret', {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, phone, email, password } = req.body;

  if (!name || !phone || !password) {
    res.status(400);
    throw new Error('Please provide name, phone, and password');
  }

  let userExists = await User.findOne({ phone });
  if (userExists) {
    res.status(400);
    throw new Error('User with this phone number already exists');
  }

  if (email) {
    userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error('User with this email already exists');
    }
  }

  const user = await User.create({
    name,
    phone,
    email,
    password,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      phone: user.phone,
      email: user.email,
      role: user.role,
      wishlist: user.wishlist,
      addresses: user.addresses,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    res.status(400);
    throw new Error('Please provide email/phone and password');
  }

  const user = await User.findOne({ 
    $or: [{ phone: identifier }, { email: identifier }] 
  });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      phone: user.phone,
      email: user.email,
      role: user.role,
      wishlist: user.wishlist,
      addresses: user.addresses,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid phone number or password');
  }
});

// @desc    Admin Login
// @route   POST /api/users/admin-login
// @access  Public
const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && user.role === 'admin' && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password, or unauthorized');
  }
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('wishlist');

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      phone: user.phone,
      email: user.email,
      role: user.role,
      wishlist: user.wishlist,
      addresses: user.addresses,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.addresses) {
      // If none are default, make the first one default
      let updatedAddresses = req.body.addresses;
      if (updatedAddresses.length > 0 && !updatedAddresses.some(a => a.isDefault)) {
        updatedAddresses[0].isDefault = true;
      }
      // If multiple are default, keep only the first one
      let defaultFound = false;
      updatedAddresses = updatedAddresses.map(a => {
        // Handle legacy addresses that might not have firstName/lastName
        if (!a.firstName) a.firstName = a.name ? a.name.split(' ')[0] : (user.name.split(' ')[0] || 'Unknown');
        if (!a.lastName) a.lastName = a.name ? (a.name.split(' ').slice(1).join(' ') || 'User') : (user.name.split(' ').slice(1).join(' ') || 'User');
        
        if (a.isDefault) {
          if (defaultFound) return { ...a, isDefault: false };
          defaultFound = true;
          return a;
        }
        return a;
      });
      console.log('updatedAddresses to save:', updatedAddresses);
      user.addresses = updatedAddresses;
    }

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();
    console.log('updatedUser.addresses after save:', updatedUser.addresses);

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      phone: updatedUser.phone,
      email: updatedUser.email,
      role: updatedUser.role,
      wishlist: updatedUser.wishlist,
      addresses: updatedUser.addresses,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Toggle product in wishlist
// @route   POST /api/users/wishlist
// @access  Private
const toggleWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const isExist = user.wishlist.find(id => id.toString() === productId);

  if (isExist) {
    // Remove from wishlist
    user.wishlist = user.wishlist.filter(id => id.toString() !== productId);
    await user.save();
    res.json({ message: 'Product removed from wishlist', wishlist: user.wishlist });
  } else {
    // Add to wishlist
    user.wishlist.push(productId);
    await user.save();
    res.json({ message: 'Product added to wishlist', wishlist: user.wishlist });
  }
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    if (user.role === 'admin') {
      res.status(400);
      throw new Error('Cannot delete an admin user');
    }
    await User.deleteOne({ _id: user._id });
    res.json({ message: 'User removed' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

module.exports = {
  loginUser,
  registerUser,
  loginAdmin,
  getUserProfile,
  updateUserProfile,
  toggleWishlist,
  getUsers,
  deleteUser,
};
