import express from 'express';
import { uploadMiddleware, uploadFile } from '../controllers/uploadController.js';
import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/adminMiddleware.js';

const router = express.Router();

// Route for single file upload
// Protected: Only admins can upload files
router.post('/', protect, admin, (req, res, next) => {
  uploadMiddleware(req, res, (err) => {
    if (err) {
      console.error('Multer error:', err);
      return res.status(400).json({ message: 'File upload error: ' + err.message });
    }
    next();
  });
}, uploadFile);

export default router;
