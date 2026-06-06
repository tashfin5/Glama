const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true },
  parentCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
  image: { type: String, default: '' },
  description: { type: String, default: '' },
  views: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);