const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const path = require('path');
const fs = require('fs');
// التصحيح هنا: إضافة الأقواس {} للاستيراد
const { requireAuth } = require('../middleware/auth'); 

// 1. إعداد Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 2. استخدم التخزين بالذاكرة لنتحكم بالرفع ونوفر fallback محلي
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Ensure uploads folder exists for local fallback
const UPLOAD_DIR = path.join(__dirname, '..', '..', 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// Helper to upload a buffer to Cloudinary (with unsigned preset support)
function uploadToCloudinaryBuffer(buffer, filename) {
  return new Promise((resolve, reject) => {
    const uploadOptions = { 
      folder: 'ctrl-zero-portfolio',
      // Support unsigned upload preset (optional, fallback to signed if secret is available)
      unsigned: !process.env.CLOUDINARY_API_SECRET || process.env.CLOUDINARY_API_SECRET.includes('***')
    };
    
    // If using unsigned upload, set the preset
    if (uploadOptions.unsigned && process.env.CLOUDINARY_UPLOAD_PRESET) {
      uploadOptions.upload_preset = process.env.CLOUDINARY_UPLOAD_PRESET;
    }
    
    const stream = cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
    stream.end(buffer);
  });
}

// 3. راوت الرفع
// try cloudinary first, fallback to local file
router.post('/', requireAuth, upload.array('files', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const results = [];

    for (const file of req.files) {
      try {
        const cldRes = await uploadToCloudinaryBuffer(file.buffer, file.originalname);
        results.push({ url: cldRes.secure_url, public_id: cldRes.public_id });
      } catch (cloudErr) {
        console.warn('Cloudinary upload failed, falling back to local storage:', cloudErr.message);
        // Save locally
        const safeName = `${Date.now()}-${file.originalname.replace(/[^a-z0-9._-]/gi, '-')}`;
        const outPath = path.join(UPLOAD_DIR, safeName);
        fs.writeFileSync(outPath, file.buffer);
        const url = `${req.protocol}://${req.get('host')}/uploads/${safeName}`;
        results.push({ url, public_id: `local:${safeName}` });
      }
    }

    res.json({ uploaded: results });
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ error: error.message || 'Upload failed' });
  }
});

router.delete('/', requireAuth, async (req, res) => {
  const { public_id } = req.body;
  if (!public_id) return res.status(400).json({ error: 'Missing public_id' });

  try {
    if (String(public_id).startsWith('local:')) {
      // Delete local file
      const filename = public_id.replace('local:', '');
      const filePath = path.join(UPLOAD_DIR, filename);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      return res.json({ success: true, local: true });
    }

    await cloudinary.uploader.destroy(public_id);
    res.json({ success: true });
  } catch (error) {
    console.error('Delete upload failed:', error);
    res.status(500).json({ error: 'Delete failed' });
  }
});

module.exports = router;