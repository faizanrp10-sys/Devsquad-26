const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const dns = require('dns');
require('dotenv').config();

// Force DNS servers to Google's to help with SRV resolution on some networks
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) {
  console.warn('Could not set DNS servers, proceeding with default.');
}

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Database Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      family: 4 // Force IPv4
    });
    console.log('Connected to MongoDB');

    // Auto-seed if database is empty
    const Product = require('./src/models/Product');
    const User = require('./src/models/User');
    const { users, products } = require('./src/data/initialData');
    
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      console.log('Database is empty. auto-seeding starting...');
      await User.deleteMany({});
      await User.create(users);
      await Product.insertMany(products);
      console.log('Auto-seeding completed successfully');
    }
  } catch (err) {
    console.error('Could not connect to MongoDB');
    console.error('Error details:', err.message);
    
    if (err.message.includes('ECONNREFUSED')) {
      console.log('\n--- EXACT FIX REQUIRED ---');
      console.log('Your network/DNS is blocking MongoDB SRV records.');
      console.log('1. Go to MongoDB Atlas (https://cloud.mongodb.com)');
      console.log('2. Click "Connect" -> "Drivers"');
      console.log('3. Select Node.js version "2.2.12 or later"');
      console.log('4. Copy the connection string (it starts with "mongodb://" NOT "mongodb+srv://")');
      console.log('5. Paste it into your backend/.env file as MONGODB_URI');
      console.log('--------------------------\n');
    }
  }
};

connectDB();

// Routes
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/products', require('./src/routes/productRoutes'));
app.use('/api/cart', require('./src/routes/cartRoutes'));
app.use('/api/orders', require('./src/routes/orderRoutes'));
app.use('/api/admin', require('./src/routes/adminRoutes'));

app.get('/', (req, res) => {
  res.send('Tea Ecommerce API is running...');
});

app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';
  res.json({
    status: 'Server is running',
    database: dbStatus,
    timestamp: new Date(),
    env: process.env.NODE_ENV
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: 'Something went wrong!', error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
