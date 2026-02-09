const jwt = require('jsonwebtoken');

function requireAuth(req, res, next) {
  const auth = req.headers.authorization;
  
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Missing or invalid authorization header. Use "Authorization: Bearer <token>"'
    });
  }

  try {
    const token = auth.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'fallback_secret_dont_use_in_production';
    
    const payload = jwt.verify(token, secret);
    req.admin = payload;
    next();
  } catch (err) {
    console.error('Auth verification failed:', err.message);
    const statusCode = err.name === 'TokenExpiredError' ? 401 : 401;
    const errorMsg = err.name === 'TokenExpiredError' 
      ? 'Token has expired. Please log in again.' 
      : 'Invalid or malformed token';
    
    return res.status(statusCode).json({
      error: 'Authentication failed',
      message: errorMsg
    });
  }
}

module.exports = { requireAuth };