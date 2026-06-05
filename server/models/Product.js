const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  name: { type: String, required: true },
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
  image: { type: String }
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  name: { type: String, required: true, trim: true },
  slug: { type: String, unique: true, index: true },
  brand: { type: String, default: '' },
  description: { type: String, required: true },
  price: { type: Number, required: true, default: 0 },
  discountPrice: { type: Number, default: 0 },
  stock: { type: Number, required: true, default: 0 },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  images: [{ type: String, required: true }],
  isKBeauty: { type: Boolean, default: false },
  skinType: { type: [String], default: ['All'] },
  tags: { type: [String], default: [] },
  reviews: [reviewSchema],
  rating: { type: Number, required: true, default: 0 },
  numReviews: { type: Number, required: true, default: 0 }
}, { timestamps: true });

// Auto-generate slug before saving
productSchema.pre('save', function() {
  if (!this.isModified('name')) {
    return;
  }
  
  // Generate basic slug
  let slug = this.name.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
    
  if (this.isNew) {
    const shortId = Math.random().toString(36).substring(2, 6);
    this.slug = `${slug}-${shortId}`;
  } else if (!this.slug) {
    const shortId = Math.random().toString(36).substring(2, 6);
    this.slug = `${slug}-${shortId}`;
  }
});

module.exports = mongoose.model('Product', productSchema);