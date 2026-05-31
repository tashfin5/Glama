const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  // Customers will use phone number for OTP login
  phone: {
    type: String,
    unique: true,
    sparse: true, // sparse allows multiple nulls/undefined but enforces uniqueness if exists
  },
  // Admins will use email and password
  email: {
    type: String,
    unique: true,
    sparse: true,
  },
  password: {
    type: String,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  otp: {
    type: String,
  },
  otpExpiry: {
    type: Date,
  },
  wishlist: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  }],
  addresses: [{
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    shippingArea: { type: String, required: true, default: 'Inside Dhaka' },
    label: { type: String, default: 'Home' }, // Home, Work, etc.
    isDefault: { type: Boolean, default: false }
  }],
}, {
  timestamps: true,
});

// Method to check entered password against hashed password in database (for admin)
userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

// Pre-save middleware to hash password before saving to db
userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }

  if (this.password) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
});

module.exports = mongoose.model('User', userSchema);
