const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, unique: true },
  slug: { type: String, required: true, unique: true },
  image: { type: String, default: '' },
  description: { type: String, default: '' },
  isFeatured: { type: Boolean, default: false },
  views: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Brand', brandSchema);
