import User from '../models/User.js';
import Video from '../models/Video.js';

// @desc    Get all users
// @route   GET /api/admin/users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).populate('subscription.planId');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Block or Unblock a user
// @route   PUT /api/admin/users/:id/block
export const toggleBlockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      user.isBlocked = !user.isBlocked;
      await user.save();
      res.json({ message: `User ${user.isBlocked ? 'blocked' : 'unblocked'} successfully`, isBlocked: user.isBlocked });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Dashboard stats
// @route   GET /api/admin/stats
export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalVideos = await Video.countDocuments();
    const activeSubscriptions = await User.countDocuments({ 'subscription.status': 'active', role: 'user' });
    
    res.json({ totalUsers, totalVideos, activeSubscriptions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
