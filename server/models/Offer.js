const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
  },
  image: {
    type: String,
    required: true,
  },
  mobileImage: {
    type: String,
  },
  titleColor: {
    type: String,
    default: '#ffffff',
  },
  descriptionColor: {
    type: String,
    default: '#e5e7eb',
  },
  offerType: {
    type: [String],
    enum: ['STANDARD', 'PERCENTAGE', 'FIXED', 'BOGO', 'BUNDLE'],
    default: ['STANDARD']
  },
  discountValue: {
    type: Number,
    default: 0
  },
  buyQuantity: {
    type: Number,
    default: 1
  },
  getQuantity: {
    type: Number,
    default: 1
  },
  bundlePrice: {
    type: Number,
    default: 0
  },
  bogoBuyProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  bogoGetProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  bundles: [{
    bundleName: String,
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    bundlePrice: Number
  }],
  isActive: {
    type: Boolean,
    default: true,
  },
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  }],
}, {
  timestamps: true,
});

module.exports = mongoose.model('Offer', offerSchema);
