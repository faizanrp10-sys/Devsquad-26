import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  genre: { type: String, required: true },
  duration: { type: String, required: true },
  releaseYear: { type: Number, required: true },
  thumbnailUrl: { type: String, required: true },
  videoUrl: { type: String, required: true },
  isPublished: { type: Boolean, default: true },
  views: { type: Number, default: 0 },
  category: { type: String, enum: ['Movies', 'Shows'], default: 'Movies' },
  rating: { type: Number, min: 0, max: 10, default: 0 }, // IMDb-like rating
  language: { type: String, default: 'English' },
  subtitle: { type: String, default: 'English' },
  director: { type: String, default: '' },
  cast: [{ type: String }],
  ageRating: { type: String, enum: ['G', 'PG', 'PG-13', 'R', 'NC-17'], default: 'PG' }
}, { timestamps: true });

const Video = mongoose.model('Video', videoSchema);
export default Video;
