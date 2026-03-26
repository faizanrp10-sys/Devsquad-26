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

// Database Connection Utility
const connectDB = require('./src/config/db');

// Ensure DB is connected for every request (Serverless friendly)
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(503).json({ 
      success: false,
      message: 'Database connection failed. Please try again in a moment.',
      error: err.message
    });
  }
});

// One-time initialization (like seeding) can be handled here or in a separate task
const initializeDB = async () => {
    try {
        await connectDB();
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
        console.error('Initialization error:', err.message);
    }
};

// Only run seeding logic in development or explicitly if needed
if (process.env.NODE_ENV !== 'production') {
    initializeDB();
}

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
