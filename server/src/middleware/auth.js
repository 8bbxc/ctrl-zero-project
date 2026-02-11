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
    
    // If token is expired, send a specific response indicating the client should refresh
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Token expired',
        message: 'Your access token has expired. Please use your refresh token to get a new access token.',
        code: 'TOKEN_EXPIRED'
      });
    }
    
    // For other auth errors
    const errorMsg = err.name === 'JsonWebTokenError' 
      ? 'Invalid or malformed token' 
      : 'Authentication failed';
    
    return res.status(401).json({
      error: 'Authentication failed',
      message: errorMsg
    });
  }
}

module.exports = { requireAuth };
