const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const migrateSlugs = async () => {
  try {
    await connectDB();

    const products = await Product.find({});
    console.log(`Found ${products.length} products to migrate...`);

    for (const product of products) {
      if (!product.slug) {
        let slug = product.name.toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '');
        
        const shortId = Math.random().toString(36).substring(2, 6);
        product.slug = `${slug}-${shortId}`;
        
        await product.save();
        console.log(`Updated product: ${product.name} with slug: ${product.slug}`);
      }
    }

    console.log('Migration completed successfully!');
    process.exit();
  } catch (error) {
    console.error(`Migration failed: ${error}`);
    process.exit(1);
  }
};

migrateSlugs();
