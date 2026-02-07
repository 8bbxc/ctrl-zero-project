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
    url: '',
    tags: ['Node.js','Express','React','Gemini API']
  },
  {
    title: 'Najah Hub',
    slug: 'najah-hub',
    description: 'A comprehensive full-stack platform built with the MERN stack featuring secure authentication and complex database architecture.',
    content: 'Najah Hub is a feature-rich platform with authentication, role-based access, and complex data flows. Designed for reliability and maintainability.',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
    images: ['https://via.placeholder.com/1200x720.png?text=Najah+1','https://via.placeholder.com/1200x720.png?text=Najah+2'],
    url: '',
    tags: ['MongoDB','Express','React','Node.js','Tailwind']
  },
  {
    title: 'My Portfolio',
    slug: 'my-portfolio',
    description: 'This responsive portfolio website, featuring a scalable PostgreSQL database, Prisma ORM, and a secure admin dashboard.',
    content: 'A personal portfolio showcasing projects and services, built with Vite, React, Prisma and PostgreSQL. Includes a secure admin dashboard for managing content.',
    image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80',
    images: ['https://via.placeholder.com/1200x720.png?text=Portfolio+1','https://via.placeholder.com/1200x720.png?text=Portfolio+2','https://via.placeholder.com/1200x720.png?text=Portfolio+3'],
    url: '',
    tags: ['PostgreSQL','Prisma','React','Vite']
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
        update: { title: p.title, description: p.description, content: p.content, image: p.image, images: p.images || [], gallery: p.gallery || [], url: p.url, tags: p.tags },
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
