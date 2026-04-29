"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require('mongoose');
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
require('dotenv').config();
const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/pos-system';
const RawMaterialSchema = new mongoose.Schema({ name: String, unit: String, stock: Number, minLevel: Number }, { timestamps: true });
const ProductSchema = new mongoose.Schema({
    name: String,
    price: Number,
    image: String,
    category: String,
    recipe: [{ materialId: mongoose.Types.ObjectId, quantity: Number }],
}, { timestamps: true });
const RawMaterial = mongoose.model('RawMaterial', RawMaterialSchema);
const Product = mongoose.model('Product', ProductSchema);
async function seed() {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');
    await RawMaterial.deleteMany({});
    await Product.deleteMany({});
    console.log('Cleared existing data');
    const materials = await RawMaterial.insertMany([
        { name: 'Noodles', unit: 'g', stock: 5000, minLevel: 500 },
        { name: 'Spinach', unit: 'g', stock: 2000, minLevel: 200 },
        { name: 'Seafood Mix', unit: 'g', stock: 3000, minLevel: 300 },
        { name: 'Mushrooms', unit: 'g', stock: 2000, minLevel: 200 },
        { name: 'Pasta', unit: 'g', stock: 4000, minLevel: 400 },
        { name: 'Beef', unit: 'g', stock: 3000, minLevel: 300 },
        { name: 'Eggs', unit: 'pcs', stock: 100, minLevel: 10 },
        { name: 'Rice', unit: 'g', stock: 5000, minLevel: 500 },
        { name: 'Spice Mix', unit: 'g', stock: 1000, minLevel: 100 },
        { name: 'Soup Base', unit: 'ml', stock: 3000, minLevel: 300 },
        { name: 'Salt', unit: 'g', stock: 2000, minLevel: 200 },
        { name: 'Cooking Oil', unit: 'ml', stock: 3000, minLevel: 300 },
    ]);
    console.log(`Inserted ${materials.length} raw materials`);
    const m = (name) => materials.find((mat) => mat.name === name)._id;
    const products = await Product.insertMany([
        {
            name: 'Spicy seasoned seafood noodles',
            price: 2.29,
            image: '/images/Spicy-seasoned-seafood-noodles.png',
            category: 'Hot Dishes',
            recipe: [
                { materialId: m('Noodles'), quantity: 200 },
                { materialId: m('Seafood Mix'), quantity: 150 },
                { materialId: m('Spice Mix'), quantity: 20 },
                { materialId: m('Cooking Oil'), quantity: 30 },
            ],
        },
        {
            name: 'Salted Pasta with mushroom sauce',
            price: 2.69,
            image: '/images/Salted Pasta with mushroom sauce.png',
            category: 'Hot Dishes',
            recipe: [
                { materialId: m('Pasta'), quantity: 250 },
                { materialId: m('Mushrooms'), quantity: 100 },
                { materialId: m('Salt'), quantity: 10 },
                { materialId: m('Cooking Oil'), quantity: 20 },
            ],
        },
        {
            name: 'Beef dumpling in hot and sour soup',
            price: 2.99,
            image: '/images/Beef dumpling in hot and sour soup.png',
            category: 'Soup',
            recipe: [
                { materialId: m('Beef'), quantity: 150 },
                { materialId: m('Soup Base'), quantity: 200 },
                { materialId: m('Spice Mix'), quantity: 15 },
            ],
        },
        {
            name: 'Healthy noodle with spinach leaf',
            price: 3.29,
            image: '/images/Healthy noodle with spinach leaf.png',
            category: 'Hot Dishes',
            recipe: [
                { materialId: m('Noodles'), quantity: 200 },
                { materialId: m('Spinach'), quantity: 100 },
                { materialId: m('Cooking Oil'), quantity: 15 },
            ],
        },
        {
            name: 'Spicy instant noodle with special omelette',
            price: 3.49,
            image: '/images/Spicy instant noodle with special omelette.png',
            category: 'Hot Dishes',
            recipe: [
                { materialId: m('Noodles'), quantity: 200 },
                { materialId: m('Eggs'), quantity: 2 },
                { materialId: m('Spice Mix'), quantity: 25 },
                { materialId: m('Cooking Oil'), quantity: 30 },
            ],
        },
        {
            name: 'Hot spicy fried rice with omelet',
            price: 3.49,
            image: '/images/Spicy instant noodle with special omelette.png',
            category: 'Hot Dishes',
            recipe: [
                { materialId: m('Rice'), quantity: 300 },
                { materialId: m('Eggs'), quantity: 2 },
                { materialId: m('Spice Mix'), quantity: 20 },
                { materialId: m('Cooking Oil'), quantity: 40 },
            ],
        },
    ]);
    console.log(`Inserted ${products.length} products`);
    console.log('\nSeed completed successfully!');
    await mongoose.disconnect();
}
seed().catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
});
//# sourceMappingURL=seed.js.map