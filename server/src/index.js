require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');
const fs = require('fs'); // استيراد مكتبة الملفات
const apiLimiter = require('./middleware/rateLimiter');
const prisma = require('./utils/prisma');

// --- Import Routes ---
const projectsRoutes = require('./routes/projects');
const authRoutes = require('./routes/auth');
const contactRoutes = require('./routes/contact');
const messagesRoutes = require('./routes/messages');
const uploadRoutes = require('./routes/upload');
const servicesRoutes = require('./routes/services');

const app = express();

// --- Ensure Uploads Directory Exists (إضافة احترافية) ---
// هذا الكود يتأكد من وجود مجلد الصور، وإذا لم يجده يقوم بإنشائه فوراً
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)){
    fs.mkdirSync(uploadsDir);
    console.log('📂 Created uploads directory successfully.');
}

// 1. CORS Configuration
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

// 2. Security Headers
// يسمح بتحميل الصور من السيرفر في الفرونت إند
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }, 
}));

// 3. Body Parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 4. Rate Limiter
// يفضل وضعه بعد الملفات الاستاتيكية إذا كانت الصور كثيرة، لكنه هنا مقبول للحماية العامة
app.use('/api', apiLimiter); 

// 5. Serve Static Files
app.use('/uploads', express.static(uploadsDir));

// --- API Routes ---
app.use('/api/projects', projectsRoutes);
app.use('/api/admin', authRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/services', servicesRoutes);

// --- Health Check ---
app.get('/health', async (req, res) => {
  const result = { server: true };
  try {
    await prisma.$queryRaw`SELECT 1`;
    result.database = true;
    return res.json({ ok: true, ...result });
  } catch (err) {
    console.error('Health check failed (DB):', err.message);
    return res.status(500).json({ ok: false, server: true, database: false, error: 'Database unavailable' });
  }
});

// --- Production Settings ---
if (process.env.NODE_ENV === 'production') {
  if (!process.env.DATABASE_URL) {
    console.error('FATAL: DATABASE_URL is required in production. Exiting.');
    process.exit(1);
  }
  
  app.use(express.static(path.join(__dirname, '..', '..', 'client', 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'client', 'dist', 'index.html'));
  });
}

// --- Error Handling ---
app.use((req, res) => res.status(404).json({ error: 'Endpoint not found' }));

app.use((err, req, res, next) => {
  console.error('🔥 Server Error Stack:', err.stack);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

// --- Start Server ---
const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`🚀 Server running on port ${port}`));