import express from 'express';
import { getAllUsers, toggleBlockUser, getDashboardStats } from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.use(protect, admin); // All admin routes protected and admin-only

router.get('/users', getAllUsers);
router.put('/users/:id/block', toggleBlockUser);
router.get('/stats', getDashboardStats);

export default router;
