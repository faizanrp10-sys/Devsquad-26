import multer from 'multer';


import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Parse Cloudinary URL and configure
if (process.env.CLOUDINARY_URL) {
  try {
    // Cloudinary URL format: cloudinary://api_key:api_secret@cloud_name
    const url = new URL(process.env.CLOUDINARY_URL);
    cloudinary.config({
      cloud_name: url.host,
      api_key: url.username,
      api_secret: url.password
    });
    console.log('Cloudinary configured successfully');
  } catch (error) {
    console.error('Error parsing Cloudinary URL:', error);
  }
} else {
  console.error("CLOUDINARY_URL not found in environment variables");
}

// Configure Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    console.log('Uploading file:', file.originalname, 'MIME type:', file.mimetype);
    const isVideo = file.mimetype.startsWith('video');
    return {
      folder: 'streamvibe',
      resource_type: isVideo ? 'video' : 'image',
      public_id: `${file.fieldname}-${Date.now()}`,
    };
  },
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    console.log('File filter - file:', file.originalname);
    cb(null, true);
  }
});

export const uploadFile = (req, res) => {
  try {
    console.log('uploadFile called - req.file:', req.file);
    if (!req.file) {
      console.error('No file in request');
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    console.log('File uploaded successfully:', req.file);
    res.status(200).json({ 
      message: 'File uploaded to Cloudinary successfully',
      url: req.file.path // Correct secure URL from Cloudinary
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Error uploading file', error: error.message });
  }
};

export const uploadMiddleware = upload.single('file');
