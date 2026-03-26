const mongoose = require('mongoose');
require('dotenv').config();

console.log('Testing connection to:', process.env.MONGODB_URI.replace(/:([^:@]+)@/, ':****@'));

const testConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      family: 4
    });
    console.log('SUCCESS: Connected to MongoDB!');
    process.exit(0);
  } catch (err) {
    console.error('FAILURE: Could not connect to MongoDB');
    console.error('Error Name:', err.name);
    console.error('Error Message:', err.message);
    console.error('Error Code:', err.code);
    
    if (err.message.includes('ECONNREFUSED')) {
      console.log('\n--- DIAGNOSIS: DNS/SRV ISSUE ---');
      console.log('This is likely because your DNS cannot resolve the SRV records for the cluster.');
      console.log('Please try the following:');
      console.log('1. Go to your MongoDB Atlas Dashboard.');
      console.log('2. Click "Connect" -> "Connect your application".');
      console.log('3. Select "Node.js" and version "2.2.12 or later" (this gives the standard connection string).');
      console.log('4. It should look like: mongodb://<user>:<password>@cluster0-shard-00-00.mnbpo5p.mongodb.net:27017,...');
      console.log('5. Use THAT string in your .env file instead.');
    } else if (err.message.includes('authentication failed')) {
      console.log('\n--- DIAGNOSIS: AUTHENTICATION ISSUE ---');
      console.log('Your username or password may be incorrect.');
    }
    
    process.exit(1);
  }
};

testConnection();
