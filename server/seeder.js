const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const User = require('./models/User');
const Product = require('./models/Product');
const Category = require('./models/Category');
const Order = require('./models/Order');
const Offer = require('./models/Offer');
const Brand = require('./models/Brand');
const products = require('./data/products');
const brands = require('./data/brands');
const offers = require('./data/offers');

dotenv.config();
connectDB();

const importData = async () => {
  try {
    // 1. Wipe the database clean
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    await Category.deleteMany();
    await Brand.deleteMany();
    await Offer.deleteMany();

    // 2. Create Users
    const createdUsers = await User.create([
      {
        name: 'Admin User',
        email: 'admin@glama.com',
        password: 'password123', // Pre-save middleware will hash this
        role: 'admin',
      },
      {
        name: 'John Doe',
        phone: '01700000000',
        role: 'user',
      },
    ]);

    const adminUserId = createdUsers[0]._id;

    // 3. Create categories
    const categoriesData = [
      { name: "Skincare", slug: "skincare", image: "https://images.unsplash.com/photo-1570194065650-d99fb4b8f72a?w=400&q=80", description: "Discover our curated selection of high-performance skincare products tailored to reveal your natural glow." },
      { name: "Makeup", slug: "makeup", image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80", description: "Enhance your beauty with our premium makeup collection, featuring vibrant colors and flawless finishes." },
      { name: "Haircare", slug: "haircare", image: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=400&q=80", description: "Nourish and style your hair with our expert range of luxurious haircare essentials." },
      { name: "Bath & Body", slug: "bath-and-body", image: "https://images.unsplash.com/photo-1608222351212-18fe0ec7b13b?w=400&q=80", description: "Indulge in ultimate relaxation with our soothing and refreshing bath and body treats." },
      { name: "Fragrances", slug: "fragrances", image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&q=80", description: "Leave a lasting impression with our exquisite collection of luxury perfumes and fragrances." },
      { name: "Tools & Accessories", slug: "tools-and-accessories", image: "https://images.unsplash.com/photo-1590159763121-7c91350a4552?w=400&q=80", description: "Elevate your routine with our professional-grade beauty tools and essential accessories." }
    ];
    
    const createdCategories = await Category.insertMany(categoriesData);

    // Create a map of category names to their IDs
    const categoryMap = {};
    createdCategories.forEach(cat => {
      categoryMap[cat.name] = cat._id;
    });

    // 4. Attach category ID and Admin User to products
    const sampleProducts = products.map((product) => {
      const { categoryName, ...productData } = product;
      return { 
        ...productData, 
        category: categoryMap[categoryName] || createdCategories[0]._id, 
        user: adminUserId 
      };
    });

    // 5. Create brands
    await Brand.insertMany(brands);

    // 6. Insert products into DB
    const insertedProducts = await Product.insertMany(sampleProducts);

    // Create a map of product names to their IDs for offers
    const productMap = {};
    insertedProducts.forEach(p => {
      productMap[p.name] = p._id;
    });

    // 7. Attach product IDs to offers and insert
    const sampleOffers = offers.map(offer => {
      const { bogoBuyProductNames, bogoGetProductNames, productNames, bundles, ...offerData } = offer;
      
      const newOffer = { ...offerData };
      
      if (bogoBuyProductNames) {
        newOffer.bogoBuyProducts = bogoBuyProductNames.map(name => productMap[name]).filter(Boolean);
      }
      if (bogoGetProductNames) {
        newOffer.bogoGetProducts = bogoGetProductNames.map(name => productMap[name]).filter(Boolean);
      }
      if (productNames) {
        newOffer.products = productNames.map(name => productMap[name]).filter(Boolean);
      }
      if (bundles) {
        newOffer.bundles = bundles.map(bundle => ({
          bundleName: bundle.bundleName,
          bundlePrice: bundle.bundlePrice,
          products: bundle.productNames.map(name => productMap[name]).filter(Boolean)
        }));
      }
      
      return newOffer;
    });

    await Offer.insertMany(sampleOffers);

    console.log('Data Imported Successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  // destroyData function could go here
} else {
  importData();
}