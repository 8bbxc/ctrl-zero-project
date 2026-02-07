const jwt = require('jsonwebtoken');

function requireAuth(req, res, next) {
  const auth = req.headers.authorization;
  
  // 1. التأكد أن الهيدر موجود ويبدأ بكلمة Bearer
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid authorization format' });
  }

  const token = auth.split(' ')[1];

  try {
    // 2. التأكد من وجود JWT_SECRET
    // إذا لم يكن موجوداً، التوكن لن يعمل بشكل صحيح
    const secret = process.env.JWT_SECRET || 'fallback_secret_dont_use_in_production';
    
    const payload = jwt.verify(token, secret);
    req.admin = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

module.exports = { requireAuth };