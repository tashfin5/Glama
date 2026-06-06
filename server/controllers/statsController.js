const asyncHandler = require('express-async-handler');
const SiteStats = require('../models/SiteStats');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Brand = require('../models/Brand');
const Offer = require('../models/Offer');

// @desc    Increment overall site views
// @route   POST /api/stats/site
// @access  Public
const incrementSiteViews = asyncHandler(async (req, res) => {
  let stats = await SiteStats.findOne({ page: 'main' });
  if (!stats) {
    stats = new SiteStats({ page: 'main', views: 0 });
  }
  stats.views += 1;
  await stats.save();
  res.json({ message: 'Site view incremented', views: stats.views });
});

// @desc    Get aggregated stats for Admin Dashboard
// @route   GET /api/stats
// @access  Private/Admin
const getAggregatedStats = asyncHandler(async (req, res) => {
  // Aggregate views from all collections
  const productViewsAgg = await Product.aggregate([{ $group: { _id: null, totalViews: { $sum: '$views' } } }]);
  const categoryViewsAgg = await Category.aggregate([{ $group: { _id: null, totalViews: { $sum: '$views' } } }]);
  const brandViewsAgg = await Brand.aggregate([{ $group: { _id: null, totalViews: { $sum: '$views' } } }]);
  const offerViewsAgg = await Offer.aggregate([{ $group: { _id: null, totalViews: { $sum: '$views' } } }]);
  
  const siteStats = await SiteStats.findOne({ page: 'main' });

  const productViews = productViewsAgg[0]?.totalViews || 0;
  const categoryViews = categoryViewsAgg[0]?.totalViews || 0;
  const brandViews = brandViewsAgg[0]?.totalViews || 0;
  const offerViews = offerViewsAgg[0]?.totalViews || 0;
  const mainSiteViews = siteStats?.views || 0;

  const totalViews = productViews + categoryViews + brandViews + offerViews + mainSiteViews;

  res.json({
    totalViews,
    breakdown: {
      products: productViews,
      categories: categoryViews,
      brands: brandViews,
      offers: offerViews,
      mainSite: mainSiteViews,
    }
  });
});

module.exports = {
  incrementSiteViews,
  getAggregatedStats,
};
