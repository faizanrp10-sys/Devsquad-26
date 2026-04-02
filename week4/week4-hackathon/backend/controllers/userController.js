import User from '../models/User.js';
import Plan from '../models/Plan.js';

// @desc    Get user profile
// @route   GET /api/users/profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('subscription.planId');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Activate a subscription plan (mock payment)
// @route   POST /api/users/subscription/activate
export const activateSubscription = async (req, res) => {
  try {
    const { planId, cardNumber, expiry, cvv } = req.body;
    
    // Mock payment validation logic
    if (!cardNumber || !expiry || !cvv || cardNumber.length < 16) {
      return res.status(400).json({ message: 'Invalid card details' });
    }

    const plan = await Plan.findById(planId);
    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }

    const user = await User.findById(req.user._id);
    if (user) {
      user.subscription = {
        planId: plan._id,
        status: 'active',
        startDate: new Date(),
        endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)) // 1 month validity
      };
      await user.save();
      
      res.json({ message: 'Subscription activated successfully', subscription: user.subscription });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
