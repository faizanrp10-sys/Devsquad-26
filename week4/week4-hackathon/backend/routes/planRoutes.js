import express from 'express';
import { getPlans, createPlan, updatePlan, deletePlan } from '../controllers/planController.js';
import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.route('/').get(getPlans).post(protect, admin, createPlan);
router.route('/:id').put(protect, admin, updatePlan).delete(protect, admin, deletePlan);

export default router;
