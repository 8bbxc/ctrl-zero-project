const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const path = require('path');
const fs = require('fs');
const { requireAuth } = require('../middleware/auth');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer config with memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 20
  },
  fileFilter: (req, file, cb) => {
    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!ALLOWED_TYPES.includes(file.mimetype)) {
      return cb(new Error(`Invalid file type: ${file.mimetype}`), false);
    }
    cb(null, true);
  }
});

// Ensure uploads directory exists
const UPLOAD_DIR = path.join(__dirname, '..', '..', 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Helper: Upload buffer to Cloudinary
function uploadToCloudinaryBuffer(buffer, filename) {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      folder: 'ctrl-zero-portfolio',
      resource_type: 'auto',
      timeout: 60000
    };
    
    if (process.env.CLOUDINARY_UPLOAD_PRESET) {
      uploadOptions.upload_preset = process.env.CLOUDINARY_UPLOAD_PRESET;
      uploadOptions.unsigned = true;
    }
    
    const stream = cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
    
    stream.on('error', (err) => reject(err));
    stream.end(buffer);
  });
}

// Helper: Save file locally
function saveLocalFile(buffer, originalname) {
  const safeName = `${Date.now()}-${originalname.replace(/[^a-z0-9._-]/gi, '-')}`;
  const outputPath = path.join(UPLOAD_DIR, safeName);
  fs.writeFileSync(outputPath, buffer);
  return { safeName, path: outputPath };
}

// POST /upload - Upload one or multiple files
router.post('/', requireAuth, upload.array('files', 20), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const results = [];
    const errors = [];

    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i];
      
      try {
        // Try Cloudinary first
        try {
          const cldRes = await uploadToCloudinaryBuffer(file.buffer, file.originalname);
          results.push({
            url: cldRes.secure_url,
            public_id: cldRes.public_id,
            size: file.size,
            uploaded: true
          });
          continue;
        } catch (cloudErr) {
          console.warn(`Cloudinary upload failed for ${file.originalname}:`, cloudErr.message);
        }

        // Fallback to local storage
        const { safeName } = saveLocalFile(file.buffer, file.originalname);
        const url = `${req.protocol}://${req.get('host')}/uploads/${safeName}`;
        results.push({
          url,
          public_id: `local:${safeName}`,
          size: file.size,
          uploaded: true
        });
      } catch (fileErr) {
        console.error(`File upload error for ${file.originalname}:`, fileErr.message);
        errors.push({
          filename: file.originalname,
          error: fileErr.message
        });
      }
    }

    // Return partial success if some files uploaded
    if (results.length === 0 && errors.length > 0) {
      return res.status(400).json({
        error: 'All files failed to upload',
        details: errors
      });
    }

    res.json({
      uploaded: results,
      errors: errors.length > 0 ? errors : undefined,
      message: errors.length > 0 ? `${results.length} of ${req.files.length} files uploaded` : 'All files uploaded'
    });
  } catch (error) {
    console.error('Upload route error:', error);
    res.status(500).json({
      error: 'Upload processing failed',
      message: error.message
    });
  }
});

// DELETE /upload - Delete uploaded file
router.delete('/', requireAuth, async (req, res) => {
  try {
    const { public_id } = req.body;
    
    if (!public_id) {
      return res.status(400).json({ error: 'Missing public_id' });
    }

    // Handle local files
    if (String(public_id).startsWith('local:')) {
      const filename = public_id.replace('local:', '');
      const filePath = path.join(UPLOAD_DIR, filename);
      
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
          return res.json({ success: true, type: 'local', deleted: true });
        } catch (fsErr) {
          console.error('File deletion error:', fsErr);
          return res.status(500).json({ error: 'Failed to delete local file' });
        }
      }
      return res.json({ success: true, type: 'local', deleted: false });
    }

    // Delete from Cloudinary
    try {
      const result = await cloudinary.uploader.destroy(public_id);
      res.json({
        success: true,
        type: 'cloudinary',
        result
      });
    } catch (cloudErr) {
      console.error('Cloudinary deletion error:', cloudErr);
      res.status(500).json({
        error: 'Failed to delete from Cloudinary',
        message: cloudErr.message
      });
    }
  } catch (error) {
    console.error('Delete route error:', error);
    res.status(500).json({
      error: 'Delete operation failed',
      message: error.message
    });
  }
});

module.exports = router;