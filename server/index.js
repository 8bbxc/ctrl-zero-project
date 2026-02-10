require('dotenv').config();
const express = require('express');
const compression = require('compression');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');
const fs = require('fs'); // استيراد مكتبة الملفات
const apiLimiter = require('./src/middleware/rateLimiter');
const prisma = require('./src/utils/prisma');

// --- Import Routes ---
const projectsRoutes = require('./src/routes/projects');
const authRoutes = require('./src/routes/auth');
const contactRoutes = require('./src/routes/contact');
const messagesRoutes = require('./src/routes/messages');
const uploadRoutes = require('./src/routes/upload');
const servicesRoutes = require('./src/routes/services');

const app = express();
app.set('trust proxy', 1);
// --- Ensure Uploads Directory Exists (إضافة احترافية) ---
// هذا الكود يتأكد من وجود مجلد الصور، وإذا لم يجده يقوم بإنشائه فوراً
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)){
    fs.mkdirSync(uploadsDir);
    console.log('📂 Created uploads directory successfully.');
}

// 1. CORS Configuration
// للـ Development: allow localhost:5173
// للـ Production: allow Vercel domain
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:3000',
      'https://ctrl-zero.vercel.app', // Vercel production
      process.env.CLIENT_ORIGIN
    ].filter(Boolean);
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

// 2. Security Headers
// يسمح بتحميل الصور من السيرفر في الفرونت إند
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }, 
}));

// 2.5. Compression Middleware (تحسين الأداء)
app.use(compression({
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  },
  level: 6 // compression level (1-9, حيث 6 هو التوازن الجيد)
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

// --- Diagnostic Endpoint (for debugging) ---
app.get('/api/diagnostic/project/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }

    const project = await prisma.project.findUnique({
      where: { id }
    });

    if (!project) {
      return res.status(404).json({ error: `Project ${id} not found` });
    }

    console.log('🔍 Diagnostic Info for Project', id);
    console.log('   Type of title:', typeof project.title);
    console.log('   Type of slug:', typeof project.slug);
    console.log('   Type of tags:', Array.isArray(project.tags) ? 'array' : typeof project.tags);
    console.log('   Type of gallery:', Array.isArray(project.gallery) ? 'array' : typeof project.gallery);
    console.log('   Tags content:', project.tags);
    console.log('   Gallery content:', project.gallery);

    res.json({
      diagnostic: true,
      project: {
        id: project.id,
        title: { value: project.title, type: typeof project.title },
        slug: { value: project.slug, type: typeof project.slug },
        tags: { value: project.tags, isArray: Array.isArray(project.tags) },
        gallery: { value: project.gallery, isArray: Array.isArray(project.gallery) },
        description: { type: typeof project.description, length: project.description?.length || 0 },
        content: { type: typeof project.content, length: project.content?.length || 0 }
      },
      schema: {
        title: 'String',
        slug: 'String (unique)',
        description: 'String',
        content: 'String (nullable)',
        tags: 'String[] (array)',
        gallery: 'String[] (array)',
        image: 'String (nullable)',
        link: 'String (nullable)',
        category: 'String (default: General)'
      }
    });
  } catch (error) {
    console.error('Diagnostic Error:', error);
    res.status(500).json({ diagnostic_error: error.message });
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

// --- Error Handling Middleware ---
// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Endpoint ${req.method} ${req.path} not found`,
    path: req.path
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('🔥 Error:', {
    message: err.message,
    status: err.status || err.statusCode || 500,
    method: req.method,
    path: req.path,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack
  });

  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
});

// --- Start Server ---
const port = process.env.PORT || 4000;
const server = app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
  console.log(`🔗 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🗂️  Uploads directory: ${uploadsDir}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...');
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
});