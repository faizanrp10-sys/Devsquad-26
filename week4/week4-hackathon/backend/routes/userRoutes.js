import express from 'express';
import { getUserProfile, activateSubscription } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/profile', protect, getUserProfile);
router.post('/subscription/activate', protect, activateSubscription);

export default router;
