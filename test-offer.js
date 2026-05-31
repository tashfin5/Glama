const axios = require('axios');
const mongoose = require('mongoose');

async function testPost() {
  try {
    const res = await axios.post('http://localhost:5000/api/offers', {
      title: "Test Offer",
      description: "testing",
      image: "http://example.com/img.jpg",
      isActive: true,
      offerType: ['STANDARD', 'BUNDLE'],
      bundles: [{
        bundleName: "TEST",
        bundlePrice: 500,
        products: []
      }]
    });
    console.log("Success:", res.data);
  } catch (err) {
    console.error("Error:", err.response?.data || err.message);
  }
}

testPost();
