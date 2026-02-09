const { PrismaClient } = require('@prisma/client')
// Load environment variables (ensure ADMIN_* and DATABASE_URL are visible)
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') })
const fs = require('fs')
const path = require('path')

const prisma = new PrismaClient()

const projects = [
  {
    title: 'DevLens AI',
    slug: 'devlens-ai',
    description: 'Intelligent AI web application integrating Google Gemini API for deep analysis and interactive insights.',
    content: 'DevLens AI leverages the Gemini API to provide deep analysis and interactive insights for user inputs. Built with modern web stack for performance and scalability. Features real-time processing, semantic analysis, and intelligent recommendations.',
    image: 'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?auto=format&fit=crop&w=1200&q=80',
    images: [],
    gallery: [
      'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1400&q=80'
    ],
    url: '',
    category: 'Corporate',
    tags: ['Node.js','Express','React','Gemini API', 'AI']
  },
  {
    title: 'Najah Hub',
    slug: 'najah-hub',
    description: 'Comprehensive full-stack platform with secure authentication, role-based access, and complex database architecture.',
    content: 'Najah Hub is a feature-rich platform with authentication, role-based access control, and complex data flows. Designed for reliability, maintainability, and scalability. Real-time updates and collaborative features.',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
    images: [],
    gallery: [
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1522427335684-38143abc9f3b?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1516534775068-bb6c4e8b5f89?auto=format&fit=crop&w=1400&q=80'
    ],
    url: '',
    category: 'Education',
    tags: ['MongoDB','Express','React','Node.js','Tailwind', 'MERN']
  },
  {
    title: 'My Portfolio',
    slug: 'my-portfolio',
    description: 'Responsive portfolio website with scalable PostgreSQL database, Prisma ORM, and secure admin dashboard.',
    content: 'A personal portfolio showcasing projects and services. Built with Vite, React, Prisma, and PostgreSQL. Includes secure admin dashboard for content management, category-based project filtering, and responsive design for all devices.',
    image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80',
    images: [],
    gallery: [
      'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1633356122544-f134324ef6db?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1400&q=80'
    ],
    url: '',
    category: 'Corporate',
    tags: ['PostgreSQL','Prisma','React','Vite', 'Tailwind']
  },
  {
    title: 'MediCare Plus',
    slug: 'medicare-plus',
    description: 'Advanced healthcare system with patient records, appointment scheduling, telemedicine, and HIPAA compliance.',
    content: 'MediCare Plus revolutionizes healthcare delivery with comprehensive platform for doctors, patients, and administrators. Features real-time appointment scheduling, encrypted patient records, integrated video consultation, prescription management, and insurance processing.',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80',
    images: [],
    gallery: [
      'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1631217314830-eac5fef67474?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1576091160623-112411f7a5ca?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1579154204601-01d430c69e61?auto=format&fit=crop&w=1400&q=80'
    ],
    url: '',
    category: 'Medical',
    tags: ['React','Node.js','PostgreSQL','Redis','WebRTC', 'Healthcare']
  },
  {
    title: 'LuxeCart E-Commerce',
    slug: 'luxecart-ecommerce',
    description: 'Premium e-commerce platform with AI recommendations, 3D visualization, and seamless payment integration.',
    content: 'LuxeCart is state-of-the-art e-commerce solution for luxury brands. Features advanced inventory management, AI-powered recommendations, real-time analytics, multi-currency support, Stripe/PayPal integration, and 3D product visualization.',
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1200&q=80',
    images: [],
    gallery: [
      'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1633356122544-f134324ef6db?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1626806819074-3b9b3908b38e?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1590080876969-c16b90476aa2?auto=format&fit=crop&w=1400&q=80'
    ],
    url: '',
    category: 'E-Commerce',
    tags: ['Next.js','Stripe','Prisma','Redis','Three.js', 'AI']
  },
  {
    title: 'ChefHub Restaurant Management',
    slug: 'chefhub-restaurant',
    description: 'Complete restaurant system with online ordering, kitchen display, delivery tracking, and analytics.',
    content: 'ChefHub transforms restaurant operations with real-time order management, kitchen coordination, and customer engagement tools. Includes mobile app for customers, web dashboard for managers, SMS notifications, and detailed analytics for business insights.',
    image: 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=1200&q=80',
    images: [],
    gallery: [
      'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1414235077418-8ea027f20f8f?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1577992369797-8a44f7d46a17?auto=format&fit=crop&w=1400&q=80'
    ],
    url: '',
    category: 'Restaurant',
    tags: ['React Native','Node.js','MongoDB','Socket.io','Stripe', 'Mobile']
  },
  {
    title: 'EduSmart Learning Platform',
    slug: 'edusmart-platform',
    description: 'Interactive e-learning platform with live classes, course management, progress tracking, and personalized learning.',
    content: 'EduSmart empowers educators and students with all-in-one learning platform. Features live video classes using WebRTC, interactive assignments, progress analytics, gamification elements, adaptive learning algorithms, and community forums.',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
    images: [],
    gallery: [
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1522427335684-38143abc9f3b?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1516534775068-bb6c4e8b5f89?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1400&q=80'
    ],
    url: '',
    category: 'Education',
    tags: ['React','Node.js','PostgreSQL','WebRTC','TensorFlow', 'Analytics']
  },
  {
    title: 'PropConnect Real Estate',
    slug: 'propconnect-realestate',
    description: 'Modern real estate platform with virtual tours, analytics, calculators, and AI-powered recommendations.',
    content: 'PropConnect revolutionizes property buying/selling with immersive 3D virtual tours, comprehensive property analytics, intelligent AI recommendations, market insights, mortgage calculators, and CRM tools for real estate agents.',
    image: 'https://images.unsplash.com/photo-1564013799920-ab7a9c7c3ef1?auto=format&fit=crop&w=1200&q=80',
    images: [],
    gallery: [
      'https://images.unsplash.com/photo-1564013799920-ab7a9c7c3ef1?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1558036117-15cd4cecdf4c?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1460072656994-13edd7eee21a?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1400&q=80'
    ],
    url: '',
    category: 'Real Estate',
    tags: ['Next.js','Mapbox','Three.js','PostgreSQL','Machine Learning', 'Maps']
  }
]

async function seedToDb() {
  for (const p of projects) {
    // In production do not overwrite existing projects; only create if missing
    if (process.env.NODE_ENV === 'production') {
      const existing = await prisma.project.findUnique({ where: { slug: p.slug } })
      if (existing) { console.log('Skipping existing project in production:', p.slug); continue }
      await prisma.project.create({ data: p })
      console.log('Created project:', p.slug)
    } else {
      // dev: upsert is fine
      await prisma.project.upsert({
        where: { slug: p.slug },
        update: { title: p.title, description: p.description, content: p.content, image: p.image, images: p.images || [], gallery: p.gallery || [], url: p.url, category: p.category || 'General', tags: p.tags },
        create: p,
      })
      console.log('Upserted project:', p.slug)
    }
  }
}

function writeFallback() {
  const out = path.join(__dirname, 'seed-data.json')
  fs.writeFileSync(out, JSON.stringify(projects, null, 2))
  console.log('Wrote fallback seed data to', out)
}

// Ensure projects include gallery when writing fallback
projects.forEach(p => { p.gallery = p.gallery || (p.images ? p.images.slice(0,3) : (p.image ? [p.image] : [])) })

async function main() {
  const canSeedAdmin = process.env.ADMIN_SETUP_TOKEN && process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD && process.env.ADMIN_NAME

  if (!process.env.DATABASE_URL) {
    if (process.env.NODE_ENV === 'production') {
      console.error('FATAL: DATABASE_URL is required in production for seeding. Exiting.')
      process.exit(1)
    }
    console.warn('DATABASE_URL not set — writing fallback seed file instead of DB seeding.')
    writeFallback()
    if (canSeedAdmin) {
      // write admin fallback with hashed password
      const bcrypt = require('bcrypt')
      const admin = {
        email: process.env.ADMIN_EMAIL,
        name: process.env.ADMIN_NAME,
      }
      const hashed = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10)
      const out = path.join(__dirname, 'admin-seed.json')
      require('fs').writeFileSync(out, JSON.stringify({ admin: { ...admin, password: hashed } }, null, 2))
      console.log('Wrote fallback admin to', out)
    } else {
      console.log('ADMIN_* env vars missing; admin seed skipped')
    }
    return
  }

  // Seed projects to DB
  await seedToDb()

  // Seed admin to DB if env vars present
  if (canSeedAdmin) {
    const bcrypt = require('bcrypt')
    const existing = await prisma.adminUser.findUnique({ where: { email: process.env.ADMIN_EMAIL } })
    const hashed = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10)
    if (existing) {
      // In production, do not overwrite existing admin; just report
      if (process.env.NODE_ENV === 'production') {
        console.log('Admin exists; skipping update in production:', process.env.ADMIN_EMAIL)
      } else {
        await prisma.adminUser.update({ where: { email: process.env.ADMIN_EMAIL }, data: { name: process.env.ADMIN_NAME, password: hashed } })
        console.log('Updated admin user:', process.env.ADMIN_EMAIL)
      }
    } else {
      await prisma.adminUser.create({ data: { email: process.env.ADMIN_EMAIL, name: process.env.ADMIN_NAME, password: hashed } })
      console.log('Created admin user:', process.env.ADMIN_EMAIL)
    }
  } else {
    console.log('ADMIN_* env vars missing; admin seed skipped')
  }
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
