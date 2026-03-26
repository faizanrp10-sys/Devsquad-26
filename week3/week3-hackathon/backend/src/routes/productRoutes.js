const express = require('express');
const router = express.Router();
const { getProducts, getProductById, getRelatedProducts, getFilterOptions, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getProducts);
router.get('/filters', getFilterOptions);
router.get('/:id', getProductById);
router.get('/:id/related', getRelatedProducts);
router.post('/', protect, authorize('admin', 'superadmin'), createProduct);
router.put('/:id', protect, authorize('admin', 'superadmin'), updateProduct);
router.delete('/:id', protect, authorize('admin', 'superadmin'), deleteProduct);

module.exports = router;
