const mongoose = require('mongoose');

const siteStatsSchema = new mongoose.Schema({
  page: { type: String, required: true, unique: true },
  views: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('SiteStats', siteStatsSchema);
