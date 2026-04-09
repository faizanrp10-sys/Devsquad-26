const User = require('../models/User');

// @desc    Register user
// @route   POST /api/users/register
// @access  Public
exports.register = async (req, res, next) => {
    const { name, email, password } = req.body;

    try {
        const user = await User.create({
            name,
            email,
            password,
        });

        sendTokenResponse(user, 201, res);
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message,
        });
    }
};

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
exports.login = async (req, res, next) => {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            error: 'Please provide an email and password',
        });
    }

    try {
        // Check for user
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials',
            });
        }

        // Check if password matches
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials',
            });
        }

        sendTokenResponse(user, 200, res);
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message,
        });
    }
};

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    // Create token
    const token = user.getSignedJwtToken();

    res.status(statusCode).json({
        success: true,
        token,
    });
};
