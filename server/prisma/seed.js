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
    description: 'An intelligent web application integrating the Google Gemini API to analyze and interact with user inputs efficiently.',
    content: 'DevLens AI leverages the Gemini API to provide deep analysis and interactive insights for user inputs. Built with modern web stack for performance and scalability.',
    image: 'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?auto=format&fit=crop&w=1200&q=80',
    images: ['https://via.placeholder.com/1200x720.png?text=DevLens+1','https://via.placeholder.com/1200x720.png?text=DevLens+2','https://via.placeholder.com/1200x720.png?text=DevLens+3'],
    gallery: ['https://via.placeholder.com/1400x900.png?text=DevLens+Shot+1','https://via.placeholder.com/1400x900.png?text=DevLens+Shot+2','https://via.placeholder.com/1400x900.png?text=DevLens+Shot+3'],
    url: '',
    category: 'Corporate',
    tags: ['Node.js','Express','React','Gemini API']
  },
  {
    title: 'Najah Hub',
    slug: 'najah-hub',
    description: 'A comprehensive full-stack platform built with the MERN stack featuring secure authentication and complex database architecture.',
    content: 'Najah Hub is a feature-rich platform with authentication, role-based access, and complex data flows. Designed for reliability and maintainability.',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
    images: ['https://via.placeholder.com/1200x720.png?text=Najah+1','https://via.placeholder.com/1200x720.png?text=Najah+2'],
    gallery: ['https://via.placeholder.com/1400x900.png?text=Najah+Shot+1','https://via.placeholder.com/1400x900.png?text=Najah+Shot+2','https://via.placeholder.com/1400x900.png?text=Najah+Shot+3'],
    url: '',
    category: 'Education',
    tags: ['MongoDB','Express','React','Node.js','Tailwind']
  },
  {
    title: 'My Portfolio',
    slug: 'my-portfolio',
    description: 'This responsive portfolio website, featuring a scalable PostgreSQL database, Prisma ORM, and a secure admin dashboard.',
    content: 'A personal portfolio showcasing projects and services, built with Vite, React, Prisma and PostgreSQL. Includes a secure admin dashboard for managing content.',
    image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80',
    images: ['https://via.placeholder.com/1200x720.png?text=Portfolio+1','https://via.placeholder.com/1200x720.png?text=Portfolio+2','https://via.placeholder.com/1200x720.png?text=Portfolio+3'],
    gallery: ['https://via.placeholder.com/1400x900.png?text=Portfolio+Shot+1','https://via.placeholder.com/1400x900.png?text=Portfolio+Shot+2','https://via.placeholder.com/1400x900.png?text=Portfolio+Shot+3','https://via.placeholder.com/1400x900.png?text=Portfolio+Shot+4'],
    url: '',
    category: 'Corporate',
    tags: ['PostgreSQL','Prisma','React','Vite']
  },
  {
    title: 'MediCare Plus',
    slug: 'medicare-plus',
    description: 'Advanced healthcare management system with patient records, appointment scheduling, and telemedicine capabilities. Secure HIPAA-compliant platform.',
    content: 'MediCare Plus revolutionizes healthcare delivery with a comprehensive platform for doctors, patients, and administrators. Features real-time appointment scheduling, encrypted patient records, and integrated video consultation capabilities.',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1631217314830-eac5fef67474?auto=format&fit=crop&w=1400&q=80','https://images.unsplash.com/photo-1576091160623-112411f7a5ca?auto=format&fit=crop&w=1400&q=80','https://images.unsplash.com/photo-1579154204601-01d430c69e61?auto=format&fit=crop&w=1400&q=80'],
    url: '',
    category: 'Medical',
    tags: ['React','Node.js','PostgreSQL','Redis','WebRTC']
  },
  {
    title: 'LuxeCart E-Commerce',
    slug: 'luxecart-ecommerce',
    description: 'Premium e-commerce platform featuring AI-powered product recommendations, 3D product visualization, and seamless payment integration.',
    content: 'LuxeCart is a state-of-the-art e-commerce solution built for luxury brands. Features include advanced inventory management, AI recommendations, real-time analytics, and multi-currency support with Stripe integration.',
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1633356122544-f134324ef6db?auto=format&fit=crop&w=1400&q=80','https://images.unsplash.com/photo-1626806819074-3b9b3908b38e?auto=format&fit=crop&w=1400&q=80','https://images.unsplash.com/photo-1590080876969-c16b90476aa2?auto=format&fit=crop&w=1400&q=80','https://images.unsplash.com/photo-1563062133-cef03e2fda02?auto=format&fit=crop&w=1400&q=80'],
    url: '',
    category: 'E-Commerce',
    tags: ['Next.js','Stripe','Prisma','Redis','Three.js']
  },
  {
    title: 'ChefHub Restaurant Management',
    slug: 'chefhub-restaurant',
    description: 'Complete restaurant management system with online ordering, kitchen display system, delivery tracking, and analytics dashboard.',
    content: 'ChefHub transforms restaurant operations with real-time order management, kitchen coordination, and customer engagement tools. Includes mobile app for customers and admin dashboard for operations.',
    image: 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1414235077418-8ea027f20f8f?auto=format&fit=crop&w=1400&q=80','https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1400&q=80','https://images.unsplash.com/photo-1577992369797-8a44f7d46a17?auto=format&fit=crop&w=1400&q=80'],
    url: '',
    category: 'Restaurant',
    tags: ['React Native','Node.js','MongoDB','Socket.io','Stripe']
  },
  {
    title: 'EduSmart Learning Platform',
    slug: 'edusmart-platform',
    description: 'Interactive e-learning platform with live classes, course management, progress tracking, and AI-powered personalized learning paths.',
    content: 'EduSmart empowers educators and students with an all-in-one learning platform. Features include live video classes, interactive assignments, progress analytics, gamification, and adaptive learning algorithms.',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1522427335684-38143abc9f3b?auto=format&fit=crop&w=1400&q=80','https://images.unsplash.com/photo-1516534775068-bb6c4e8b5f89?auto=format&fit=crop&w=1400&q=80','https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1400&q=80'],
    url: '',
    category: 'Education',
    tags: ['React','Node.js','PostgreSQL','WebRTC','TensorFlow']
  },
  {
    title: 'PropConnect Real Estate',
    slug: 'propconnect-realestate',
    description: 'Modern real estate platform with virtual tours, property analytics, mortgage calculators, and AI-powered property recommendations.',
    content: 'PropConnect revolutionizes property buying and selling with immersive 3D virtual tours, comprehensive property analytics, and intelligent recommendations. Features market insights, valuation tools, and CRM for agents.',
    image: 'https://images.unsplash.com/photo-1564013799920-ab7a9c7c3ef1?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1558036117-15cd4cecdf4c?auto=format&fit=crop&w=1400&q=80','https://images.unsplash.com/photo-1460072656994-13edd7eee21a?auto=format&fit=crop&w=1400&q=80','https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1400&q=80'],
    url: '',
    category: 'Real Estate',
    tags: ['Next.js','Mapbox','Three.js','PostgreSQL','Machine Learning']
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
