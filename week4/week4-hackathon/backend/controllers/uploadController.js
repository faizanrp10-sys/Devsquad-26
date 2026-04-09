import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Parse Cloudinary URL and configure
if (process.env.CLOUDINARY_URL) {
  try {
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
}

// Configure Multer for Memory Storage
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    cb(null, true);
  }
});

// Helper for direct Cloudinary upload via stream
const uploadToCloudinary = (fileBuffer, mimetype, fieldname) => {
  return new Promise((resolve, reject) => {
    const isVideo = mimetype.startsWith('video');
    const uploadStream = cloudinary.uploader.upload_stream(
      { 
        folder: 'streamvibe',
        resource_type: isVideo ? 'video' : 'image',
        public_id: `${fieldname}-${Date.now()}`
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary stream upload error:', error);
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
    uploadStream.end(fileBuffer);
  });
};

export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    // Upload directly from memory buffer
    const result = await uploadToCloudinary(req.file.buffer, req.file.mimetype, req.file.fieldname);
    
    console.log('File uploaded successfully via stream:', result.secure_url);
    res.status(200).json({ 
      message: 'File uploaded to Cloudinary successfully',
      url: result.secure_url 
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Error uploading file', error: error.message });
  }
};

export const uploadMiddleware = upload.single('file');
