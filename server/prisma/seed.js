const { PrismaClient } = require('@prisma/client')
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') })
const fs = require('fs')
const path = require('path')

const prisma = new PrismaClient()

/**
 * ===================================================================
 * SEED DATA MANAGEMENT - CODE-BASED PROJECT MANAGEMENT
 * ===================================================================
 * This script seeds the database with projects and services.
 * 
 * DATA FILES:
 * - seed-data-projects.json: All projects by category
 * - seed-data-services.json: All available services
 * 
 * USAGE:
 * - Development: npm run seed (automatic via postinstall)
 * - Cleanup: node reseed.js (clear all and prepare for fresh seed)
 * 
 * To add/update projects:
 * 1. Edit seed-data-projects.json
 * 2. Git commit your changes
 * 3. Run: npx prisma db push OR npm run seed
 * ===================================================================
 */

// Load seed data from JSON files
function loadSeedData() {
  const seedDir = path.join(__dirname)
  
  const projectsPath = path.join(seedDir, 'seed-data-projects.json')
  const servicesPath = path.join(seedDir, 'seed-data-services.json')

  let projects = []
  let services = []

  try {
    if (fs.existsSync(projectsPath)) {
      const projectData = JSON.parse(fs.readFileSync(projectsPath, 'utf-8'))
      projects = projectData.projects || []
      console.log(`✅ Loaded ${projects.length} projects from seed-data-projects.json`)
    } else {
      console.warn('⚠️ seed-data-projects.json not found')
    }
  } catch (err) {
    console.error('❌ Error loading projects:', err.message)
  }

  try {
    if (fs.existsSync(servicesPath)) {
      const serviceData = JSON.parse(fs.readFileSync(servicesPath, 'utf-8'))
      services = serviceData.services || []
      console.log(`✅ Loaded ${services.length} services from seed-data-services.json`)
    } else {
      console.warn('⚠️ seed-data-services.json not found')
    }
  } catch (err) {
    console.error('❌ Error loading services:', err.message)
  }

  return { projects, services }
}

async function seedToDb() {
  const { projects, services } = loadSeedData()

  if (!projects.length && !services.length) {
    console.log('📭 No data to seed. Ensure seed-data-*.json files exist.')
    return
  }

  try {
    // Clear existing data
    console.log('\n🧹 Clearing existing data...')
    await prisma.project.deleteMany({})
    await prisma.service.deleteMany({})
    console.log('✅ Database cleared')

    // Seed Projects
    if (projects.length > 0) {
      console.log(`\n📥 Seeding ${projects.length} projects...`)
      for (const project of projects) {
        const created = await prisma.project.create({
          data: {
            title: project.title,
            slug: project.slug,
            description: project.description,
            content: project.content || '',
            image: project.image || null,
            gallery: project.gallery || [],
            tags: project.tags || [],
            link: project.link || null,
            category: project.category || 'General',
            images: project.images || []
          }
        })
        console.log(`  ✓ ${created.title}`)
      }
      console.log(`✅ Successfully seeded ${projects.length} projects`)
    }

    // Seed Services
    if (services.length > 0) {
      console.log(`\n📥 Seeding ${services.length} services...`)
      try {
        for (const service of services) {
          const created = await prisma.service.create({
            data: {
              title: service.title,
              slug: service.slug || service.title.toLowerCase().replace(/\s+/g, '-'),
              shortDescription: service.shortDescription,
              fullContent: service.fullContent || '',
              features: service.features || [],
              icon: service.icon || null,
              image: service.image || null
            }
          })
          console.log(`  ✓ ${created.title}`)
        }
        console.log(`✅ Successfully seeded ${services.length} services`)
      } catch (err) {
        if (err.meta?.column === 'features') {
          console.warn('⚠️ Services table structure outdated. Run: npx prisma migrate deploy')
          console.warn('Skipping services seeding for now.')
        } else {
          throw err
        }
      }
    }

    console.log('\n🎉 Seeding complete!')
  } catch (err) {
    console.error('❌ Error seeding database:', err.message)
    throw err
  }
}

function writeFallback() {
  const { projects, services } = loadSeedData()
  const fallbackPath = path.join(__dirname, 'seed-fallback.json')
  
  fs.writeFileSync(fallbackPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    projectsCount: projects.length,
    servicesCount: services.length,
    projects,
    services
  }, null, 2))
  
  console.log(`📁 Wrote fallback seed to ${fallbackPath}`)
}

async function main() {
  console.log('\n' + '='.repeat(70))
  console.log('🌱  SEEDING DATABASE WITH PROJECTS & SERVICES')
  console.log('='.repeat(70) + '\n')

  const canSeedAdmin = 
    process.env.ADMIN_EMAIL && 
    process.env.ADMIN_NAME && 
    process.env.ADMIN_PASSWORD

  if (!process.env.DATABASE_URL) {
    if (process.env.NODE_ENV === 'production') {
      console.error('FATAL: DATABASE_URL is required in production. Exiting.')
      process.exit(1)
    }
    console.warn('⚠️ DATABASE_URL not set — writing fallback seed file.')
    writeFallback()
    return
  }

  // Seed projects and services to DB
  await seedToDb()

  // Seed admin to DB if env vars present
  if (canSeedAdmin) {
    try {
      const bcrypt = require('bcrypt')
      const existing = await prisma.adminUser.findUnique({ where: { email: process.env.ADMIN_EMAIL } })
      const hashed = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10)
      
      if (existing) {
        if (process.env.NODE_ENV === 'production') {
          console.log('✓ Admin exists; skipping update in production')
        } else {
          await prisma.adminUser.update({ 
            where: { email: process.env.ADMIN_EMAIL }, 
            data: { name: process.env.ADMIN_NAME, password: hashed } 
          })
          console.log('✅ Updated admin user:', process.env.ADMIN_EMAIL)
        }
      } else {
        await prisma.adminUser.create({ 
          data: { 
            email: process.env.ADMIN_EMAIL, 
            name: process.env.ADMIN_NAME, 
            password: hashed 
          } 
        })
        console.log('✅ Created admin user:', process.env.ADMIN_EMAIL)
      }
    } catch (err) {
      console.error('❌ Admin seeding error:', err.message)
    }
  } else {
    console.log('ℹ️ ADMIN_* env vars missing; admin seed skipped')
  }

  console.log('\n' + '='.repeat(70))
  console.log('✨ All done! Database is ready.')
  console.log('='.repeat(70) + '\n')
}

main()
  .catch(e => { 
    console.error('❌ Fatal error:', e.message)
    console.error(e)
    process.exit(1) 
  })
  .finally(async () => { await prisma.$disconnect() })
