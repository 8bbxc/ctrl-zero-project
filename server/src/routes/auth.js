const express = require('express');
const router = express.Router();
const prisma = require('../utils/prisma');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Generate tokens helper
function generateTokens(payload) {
  const secret = process.env.JWT_SECRET || 'fallback_secret_dont_use_in_production';
  const accessToken = jwt.sign(payload, secret, { expiresIn: '1h' }); // Short-lived access token
  const refreshToken = jwt.sign(payload, secret, { expiresIn: '7d' }); // Longer-lived refresh token
  return { accessToken, refreshToken };
}

// Register admin: protected by ADMIN_SETUP_TOKEN env var to allow initial setup
router.post('/register', async (req, res) => {
  const { token } = req.body;
  if (!process.env.ADMIN_SETUP_TOKEN || token !== process.env.ADMIN_SETUP_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const { email, password, name } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  try {
    const user = await prisma.adminUser.create({ data: { email, password: hashed, name } });
    res.status(201).json({ id: user.id, email: user.email });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  // Production: require DB and do not fall back to files/env
  if (process.env.NODE_ENV === 'production') {
    try {
      const user = await prisma.adminUser.findUnique({ where: { email } });
      if (!user) return res.status(401).json({ error: 'Invalid credentials' });
      const ok = await bcrypt.compare(password, user.password);
      if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
      const { accessToken, refreshToken } = generateTokens({ id: user.id, email: user.email });
      return res.json({ accessToken, refreshToken });
    } catch (err) {
      console.error('Auth error (production):', err.message);
      return res.status(500).json({ error: 'Server error' });
    }
  }

  // Non-production: try DB, then fallbacks
  try {
    const user = await prisma.adminUser.findUnique({ where: { email } });
    if (user) {
      const ok = await bcrypt.compare(password, user.password);
      if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
      const { accessToken, refreshToken } = generateTokens({ id: user.id, email: user.email });
      return res.json({ accessToken, refreshToken });
    }
  } catch (err) {
    console.warn('DB error when looking for admin user, falling back to env/file', err.message)
  }

  // Fallback: check admin-seed.json
  try {
    const fp = require('../../prisma/admin-seed.json')
    if (fp && fp.admin && fp.admin.email === email) {
      const ok = await bcrypt.compare(password, fp.admin.password)
      if (!ok) return res.status(401).json({ error: 'Invalid credentials' })
      const { accessToken, refreshToken } = generateTokens({ email: fp.admin.email });
      return res.json({ accessToken, refreshToken })
    }
  } catch (e) {
    // no fallback file
  }

  // Final fallback: environment variables (only if set)
  if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD && process.env.ADMIN_EMAIL === email && process.env.ADMIN_PASSWORD === password) {
    const { accessToken, refreshToken } = generateTokens({ email });
    return res.json({ accessToken, refreshToken })
  }

  return res.status(401).json({ error: 'Invalid credentials' });
});

// Refresh token endpoint: exchange refreshToken for new accessToken
router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(401).json({ error: 'Missing refresh token' });
  }

  try {
    const secret = process.env.JWT_SECRET || 'fallback_secret_dont_use_in_production';
    const payload = jwt.verify(refreshToken, secret);
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(payload);
    return res.json({ accessToken, refreshToken: newRefreshToken });
  } catch (err) {
    console.error('Refresh token error:', err.message);
    return res.status(401).json({ error: 'Invalid or expired refresh token' });
  }
});

module.exports = router;
