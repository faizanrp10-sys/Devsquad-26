import mongoose from 'mongoose';

const planSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Basic, Standard, Premium
  monthlyPrice: { type: Number, required: true },
  yearlyPrice: { type: Number, required: true },
  description: { type: String, required: true },
  resolution: { type: String, required: true }, // e.g., 720p, 1080p, 4K
  devices: { type: Number, required: true, default: 1 }, // Number of devices
  adFree: { type: Boolean, default: false },
  downloads: { type: Boolean, default: false },
  HDStreaming: { type: Boolean, default: false },
  features: [{ type: String }], // Array of features
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 } // Order of display
}, { timestamps: true });

const Plan = mongoose.model('Plan', planSchema);
export default Plan;
