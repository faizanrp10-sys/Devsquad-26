const express = require('express');
const router = express.Router();
const { createOrder, getMyOrders, getAllOrders, updateOrderStatus } = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, createOrder);
router.get('/myorders', protect, getMyOrders);
router.get('/', protect, authorize('admin', 'superadmin'), getAllOrders);
router.put('/:id/status', protect, authorize('admin', 'superadmin'), updateOrderStatus);

module.exports = router;
