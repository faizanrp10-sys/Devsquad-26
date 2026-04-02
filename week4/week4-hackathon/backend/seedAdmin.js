import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';
import User from './models/User.js';

dns.setServers(['8.8.8.8', '8.8.4.4']);
dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected.');

    const adminEmail = 'admin@streamvibe.com'.toLowerCase();
    let admin = await User.findOne({ email: adminEmail });

    if (admin) {
      console.log('Admin user exists. Updating details...');
      admin.name = 'Super Admin';
      admin.email = adminEmail;
      admin.password = 'admin123';
      admin.role = 'admin';
      await admin.save();
      console.log('Admin user updated successfully.');
    } else {
      admin = await User.create({
        name: 'Super Admin',
        email: adminEmail,
        password: 'admin123',
        role: 'admin'
      });
      console.log('Admin user created successfully.');
    }

    console.log(`Email: ${adminEmail}`);
    console.log('Password: admin123');

    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedAdmin();
