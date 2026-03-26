const mongoose = require('mongoose');
require('dotenv').config();
const dns = require('dns');

// Fix for SRV resolution
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) {}

const checkData = async () => {
    try {
        console.log('Connecting to:', process.env.MONGODB_URI?.split('@')[1] || 'UNDEFINED');
        await mongoose.connect(process.env.MONGODB_URI, { 
            serverSelectionTimeoutMS: 5000,
            family: 4 
        });
        
        console.log('--- DATABASE INFO ---');
        console.log('Database Name:', mongoose.connection.name);
        
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('Collections Found:', collections.map(c => c.name).join(', '));
        
        const Product = mongoose.connection.db.collection('products');
        const count = await Product.countDocuments();
        console.log('Product Count in "products" collection:', count);
        
        if (count > 0) {
            const sample = await Product.findOne();
            console.log('Sample Product Name:', sample.name);
        } else {
            console.log('WARNING: No products found in the database. Please run "node seed.js"');
        }
        
        const User = mongoose.connection.db.collection('users');
        const userCount = await User.countDocuments();
        console.log('User Count:', userCount);

        process.exit(0);
    } catch (err) {
        console.error('--- ERROR ---');
        console.error('Connection failed:', err.message);
        if (err.message.includes('ECONNREFUSED')) {
            console.log('TIP: Your DNS is blocking SRV records. Use the "Standard Connection String" (non-SRV) format.');
        }
        process.exit(1);
    }
};

checkData();
