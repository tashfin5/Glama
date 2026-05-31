const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Offer = require('./models/Offer');
mongoose.connect(process.env.MONGO_URI);

const createSlug = (title) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

async function testPost() {
  try {
    const offer = new Offer({
      title: "Test Offer 2",
      slug: createSlug("Test Offer 2"),
      description: "testing",
      image: "http://example.com/img.jpg",
      isActive: true,
      offerType: ['STANDARD', 'BUNDLE'],
      bundles: [{ bundleName: 'TEST', bundlePrice: 500, products: [] }]
    });

    let err = offer.validateSync();
    if (err) {
      console.log("Validation Error:", err.message);
    } else {
      console.log("Valid!");
    }
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    mongoose.disconnect();
  }
}

testPost();
