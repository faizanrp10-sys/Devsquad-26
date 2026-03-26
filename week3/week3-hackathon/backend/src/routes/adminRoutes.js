const express = require('express');
const router = express.Router();
const { getAnalytics, getUsers, updateUserStatus } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('admin', 'superadmin'));

router.get('/analytics', getAnalytics);
router.get('/users', getUsers);
router.put('/users/:id/status', updateUserStatus);

module.exports = router;
