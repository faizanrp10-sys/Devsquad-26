const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g., "50g bag", "100g bag"
  price: { type: Number, required: true },
  stock: { type: Number, required: true, default: 0 },
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true }, // Black Tea, Green Tea, etc.
  flavor: { type: String }, // Spicy, Sweet, Citrus, etc.
  origin: { type: String }, // Iran, Japan, India, etc.
  qualities: { type: String }, // Smoothing, Detox, Energy, etc.
  caffeine: { type: String, enum: ['No Caffeine', 'Low Caffeine', 'Medium Caffeine', 'High Caffeine'], default: 'Medium Caffeine' },
  allergens: [{ type: String }], // Lactose-free, Gluten-free, Nuts-free, Soy-free
  organic: { type: Boolean, default: false },
  vegan: { type: Boolean, default: false },
  rating: { type: Number, default: 0 },
  images: [{ type: String }],
  variants: [variantSchema],
  basePrice: { type: Number, required: true },
  steepingInstructions: {
    servingSize: { type: String }, // "2 tsp per cup, 6 tsp per pot"
    waterTemp: { type: String }, // "100°C"
    steepingTime: { type: String }, // "3 - 6 minutes"
    colorTime: { type: String }, // "COLOR AFTER 3 MINUTES"
  },
  ingredients: [{ type: String }], // ["Black Ceylon tea", "Green Tea", "Ginger root", ...]
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
