#!/usr/bin/env node

/**
 * Emergency Re-seed Script
 * Clears and repopulates database with fresh seed data
 * Usage: node reseed.js
 */

require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const projects = [
  {
    title: 'DevLens AI',
    slug: 'devlens-ai',
    description: 'Intelligent AI web application integrating Google Gemini API for deep analysis and interactive insights.',
    content: 'DevLens AI leverages the Gemini API to provide deep analysis and interactive insights.',
    image: 'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1518779578993-ec3579fee39f?auto=format&fit=crop&w=1400&q=80'],
    category: 'Corporate',
    tags: ['Node.js', 'React', 'AI']
  },
  {
    title: 'Najah Hub',
    slug: 'najah-hub',
    description: 'Comprehensive full-stack platform with secure authentication and role-based access.',
    content: 'Najah Hub is a feature-rich platform with authentication and RBAC.',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1400&q=80'],
    category: 'Education',
    tags: ['MongoDB', 'React', 'Node.js']
  },
  {
    title: 'My Portfolio',
    slug: 'my-portfolio',
    description: 'Responsive portfolio with PostgreSQL, Prisma ORM, and secure admin dashboard.',
    content: 'A personal portfolio showcasing projects and services.',
    image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1400&q=80'],
    category: 'Corporate',
    tags: ['React', 'Prisma', 'PostgreSQL']
  },
  {
    title: 'ElectroMart Global Marketplace',
    slug: 'electromart-marketplace',
    description: 'E-commerce platform for buying and selling electronics with secure payment gateway.',
    content: 'ElectroMart is a global marketplace connecting buyers and sellers.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=1400&q=80'],
    category: 'E-Commerce',
    tags: ['Stripe', 'React', 'Node.js']
  },
  {
    title: 'MediFlow Hospital System',
    slug: 'mediflow-hospital',
    description: 'Hospital management system with patient records, appointments, and billing.',
    content: 'MediFlow streamlines hospital operations with integrated patient management.',
    image: 'https://images.unsplash.com/photo-1576091160399-5c5d07caf8c2?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1576091160399-5c5d07caf8c2?auto=format&fit=crop&w=1400&q=80'],
    category: 'Medical',
    tags: ['Healthcare', 'React', 'Node.js']
  },
  {
    title: 'InnovateHub Startup Platform',
    slug: 'innovatehub-startup',
    description: 'Ecosystem for startups to pitch ideas, connect with investors, and access mentoring.',
    content: 'InnovateHub is a comprehensive platform for startup ecosystem.',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80',
    gallery: ['https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1400&q=80'],
    category: 'Corporate',
    tags: ['Startup', 'React', 'Funding']
  }
];

async function reseed() {
  try {
    console.log('🔄 Starting database re-seed...');

    // Clear existing projects
    const deletedProjects = await prisma.project.deleteMany({});
    console.log(`✅ Deleted ${deletedProjects.count} existing projects`);

    // Create new projects
    let createdCount = 0;
    for (const project of projects) {
      await prisma.project.create({
        data: project
      });
      createdCount++;
      console.log(`✅ Created: ${project.title}`);
    }

    console.log(`\n✅ Re-seeding complete! Created ${createdCount} projects`);

    // Count final state
    const finalCount = await prisma.project.count();
    console.log(`📊 Total projects in database: ${finalCount}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Re-seed failed:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

reseed();
