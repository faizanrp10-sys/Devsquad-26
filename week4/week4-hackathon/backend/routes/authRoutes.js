import express from 'express';
import { registerUser, loginUser, adminLogin } from '../controllers/authController.js';
import User from '../models/User.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/admin-login', adminLogin);
router.get('/debug-users', async (req, res) => {
  const users = await User.find({}, '-password');
  res.json(users);
});

export default router;
