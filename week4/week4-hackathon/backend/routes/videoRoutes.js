import express from 'express';
import { 
  getVideos, getVideoById, streamVideo, 
  getAdminVideos, createVideo, updateVideo, deleteVideo 
} from '../controllers/videoController.js';
import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/adminMiddleware.js';

const router = express.Router();

// User routes
router.route('/').get(getVideos);
router.route('/:id').get(getVideoById);
router.get('/:id/stream', protect, streamVideo);

// Admin routes
router.route('/admin/all').get(protect, admin, getAdminVideos);
router.route('/').post(protect, admin, createVideo);
router.route('/:id').put(protect, admin, updateVideo).delete(protect, admin, deleteVideo);

export default router;
