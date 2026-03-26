const mongoose = require('mongoose');
const User = require('./src/models/User');
const Product = require('./src/models/Product');
const { users, products } = require('./src/data/initialData');
const dns = require('dns');
require('dotenv').config();

// Force DNS servers to Google's to help with SRV resolution
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) {}

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      family: 4
    });
    console.log('Connected to MongoDB for seeding...');

    await User.deleteMany({});
    await Product.deleteMany({});

    // Use create to trigger pre-save hooks (for password hashing)
    await User.create(users);
    console.log('Users seeded');

    await Product.insertMany(products);
    console.log('Products seeded');

    console.log('Seeding completed successfully');
    process.exit();
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
};

seedDB();
