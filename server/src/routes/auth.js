const express = require('express');
const router = express.Router();
const prisma = require('../utils/prisma');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
      const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '12h' });
      return res.json({ token });
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
      const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '12h' });
      return res.json({ token });
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
      const token = jwt.sign({ email: fp.admin.email }, process.env.JWT_SECRET, { expiresIn: '12h' })
      return res.json({ token })
    }
  } catch (e) {
    // no fallback file
  }

  // Final fallback: environment variables (only if set)
  if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD && process.env.ADMIN_EMAIL === email && process.env.ADMIN_PASSWORD === password) {
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '12h' })
    return res.json({ token })
  }

  return res.status(401).json({ error: 'Invalid credentials' });
});

module.exports = router;
