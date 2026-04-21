const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const MONGODB_URI = "mongodb://faizanrp10_db_user:A5vHTwESuy6JnRCh@ac-syusw7x-shard-00-00.mnbpo5p.mongodb.net:27017,ac-syusw7x-shard-00-02.mnbpo5p.mongodb.net:27017,ac-syusw7x-shard-00-01.mnbpo5p.mongodb.net:27017/bidding_platform?ssl=true&authSource=admin&replicaSet=atlas-3fu8m8-shard-0&appName=Cluster0";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Car' }]
}, { timestamps: true });

const CarSchema = new mongoose.Schema({
  make: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  price: { type: Number, required: true },
  auctionEndTime: { type: Date, required: true },
  status: { type: String, default: 'active' },
  shippingStatus: { type: String, default: 'not_paid' },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bodyType: { type: String, required: true },
  images: [String],
  description: String,
  winner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);
const Car = mongoose.model('Car', CarSchema);

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data (optional, but good for fresh start)
    await User.deleteMany({});
    await Car.deleteMany({});
    console.log('Cleared existing data');

    // Create a seller user
    const hashedAdminPassword = await bcrypt.hash('password123', 10);
    const admin = await User.create({
      name: 'Admin Seller',
      email: 'admin@auction.com',
      password: hashedAdminPassword
    });

    const user1Password = await bcrypt.hash('password123', 10);
    const user1 = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: user1Password
    });

    console.log('Users created');

    const now = new Date();
    const futureDate = new Date(now.getTime() + (7 * 24 * 60 * 60 * 1000)); // 7 days from now

    const cars = [
      { make: 'Bentley', model: 'Continental GT', year: 2023, price: 250000, bodyType: 'luxury', images: ['bently.jpg'], description: 'A masterpiece of luxury and performance.' },
      { make: 'Ferrari', model: '488 Pista', year: 2022, price: 320000, bodyType: 'sports', images: ['ferrari.jpg'], description: 'Unmatched speed and Italian craftsmanship.' },
      { make: 'BMW', model: 'M4 Competition', year: 2024, price: 85000, bodyType: 'sports', images: ['bmwm4.jpg'], description: 'The ultimate driving machine.' },
      { make: 'Porsche', model: '911 Carrera', year: 2023, price: 150000, bodyType: 'sports', images: ['porshe911.png'], description: 'An icon of automotive engineering.' },
      { make: 'Alpine', model: 'A110', year: 2023, price: 65000, bodyType: 'sports', images: ['alpinea110.png'], description: 'Lightweight, agile, and pure fun.' },
      { make: 'Land Rover', model: 'Range Rover SV', year: 2024, price: 120000, bodyType: 'luxury', images: ['rangrover.jpg'], description: 'Refinement and capability in equal measure.' },
      { make: 'Hyundai', model: 'Verna', year: 2022, price: 25000, bodyType: 'sedan', images: ['hyunaiverna.jpg'], description: 'Sleek design with premium features.' },
      { make: 'Kia', model: 'Carnival', year: 2023, price: 45000, bodyType: 'hatchback', images: ['kiacarnival.jpg'], description: 'The grand utility vehicle for families.' },
      { make: 'Mahindra', model: 'Thar', year: 2023, price: 35000, bodyType: 'sedan', images: ['mahindrathar.jpg'], description: 'Explore the impossible with Thar.' },
      { make: 'Maruti', model: 'Brezza', year: 2022, price: 15000, bodyType: 'hatchback', images: ['marutibareza.jpg'], description: 'The hot and techy SUV.' },
      { make: 'Tata', model: 'Tiago', year: 2021, price: 10000, bodyType: 'hatchback', images: ['tatatiago.jpg'], description: 'The fantastico hatchback.' }
    ];

    for (const carData of cars) {
      await Car.create({
        ...carData,
        auctionEndTime: futureDate,
        seller: admin._id,
        status: 'active'
      });
    }

    console.log('Cars seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
}

seed();
