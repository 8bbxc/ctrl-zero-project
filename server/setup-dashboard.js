#!/usr/bin/env node
/**
 * Setup Dashboard Data Script
 * This script initializes the admin user and seeds projects/services data
 */

require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

const ADMIN_EMAIL = 'Yazan@2006.com';
const ADMIN_PASSWORD = 'Yazan@2006.com';
const ADMIN_NAME = 'Eng. Yazan Saadeh';

// Sample Projects Data
const projects = [
  {
    title: 'DevLens AI',
    slug: 'devlens-ai',
    description: 'An intelligent web application integrating the Google Gemini API to analyze and interact with user inputs efficiently.',
    content: 'DevLens AI leverages the Gemini API to provide deep analysis and interactive insights for user inputs. Built with modern web stack for performance and scalability.',
    image: 'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?auto=format&fit=crop&w=1200&q=80',
    images: ['https://images.unsplash.com/photo-1518779578993-ec3579fee39f', 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97', 'https://images.unsplash.com/photo-1552664730-d307ca884978'],
    link: 'https://devlens-ai.vercel.app',
    tags: ['Node.js', 'Express', 'React', 'Gemini API']
  },
  {
    title: 'Najah Hub',
    slug: 'najah-hub',
    description: 'A comprehensive full-stack platform built with the MERN stack featuring secure authentication and complex database architecture.',
    content: 'Najah Hub is a feature-rich platform with authentication, role-based access, and complex data flows. Designed for reliability and maintainability. This platform serves as a central hub for educational resources.',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
    images: ['https://images.unsplash.com/photo-1555066931-4365d14bab8c', 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97'],
    link: 'https://najah-hub.vercel.app',
    tags: ['MongoDB', 'Express', 'React', 'Node.js', 'Tailwind']
  },
  {
    title: 'My Portfolio',
    slug: 'my-portfolio',
    description: 'This responsive portfolio website, featuring a scalable PostgreSQL database, Prisma ORM, and a secure admin dashboard.',
    content: 'A personal portfolio showcasing projects and services, built with Vite, React, Prisma and PostgreSQL. Includes a secure admin dashboard for managing content, uploading images, and tracking contact messages.',
    image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80',
    images: ['https://images.unsplash.com/photo-1521737604893-d14cc237f11d', 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97', 'https://images.unsplash.com/photo-1552664730-d307ca884978'],
    link: 'https://ctrl-zero.vercel.app',
    tags: ['PostgreSQL', 'Prisma', 'React', 'Vite', 'Tailwind']
  }
];

// Sample Services Data
const services = [
  {
    title: 'Full Stack Web Development',
    slug: 'full-stack-web-development',
    shortDescription: 'Building complete web applications from frontend to backend',
    fullContent: 'I develop end-to-end web applications using modern technologies. From responsive UI design with React and Tailwind CSS to scalable backend architecture with Node.js and databases, I handle every aspect of web development. I focus on performance, security, and maintainability.',
    icon: '🚀',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=500&q=60'
  },
  {
    title: 'Database Design & Optimization',
    slug: 'database-design-optimization',
    shortDescription: 'Designing efficient and scalable database architectures',
    fullContent: 'Expert in designing and optimizing database schemas using PostgreSQL, MongoDB, and other databases. I implement complex relationships, optimize queries for performance, and ensure data integrity. Whether you need a relational or NoSQL database, I design the perfect solution.',
    icon: '🗄️',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f70d504f0?auto=format&fit=crop&w=500&q=60'
  },
  {
    title: 'API Development',
    slug: 'api-development',
    shortDescription: 'Creating robust and scalable REST and GraphQL APIs',
    fullContent: 'Building RESTful and GraphQL APIs with Express.js and Node.js. I focus on clean architecture, proper error handling, authentication/authorization, rate limiting, and comprehensive API documentation. Every API is designed for security and scalability.',
    icon: '🔌',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=500&q=60'
  },
  {
    title: 'Frontend Development',
    slug: 'frontend-development',
    shortDescription: 'Creating beautiful, responsive, and interactive user interfaces',
    fullContent: 'Building stunning user interfaces with React, Vite, and Tailwind CSS. I create responsive designs that work seamlessly across all devices, implement smooth animations, and ensure excellent user experience. Modern JavaScript, component-based architecture, and best practices.',
    icon: '🎨',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=500&q=60'
  },
  {
    title: 'Authentication & Security',
    slug: 'authentication-security',
    shortDescription: 'Implementing secure authentication and protection mechanisms',
    fullContent: 'Implementing JWT-based authentication, OAuth2, password hashing with bcrypt, and role-based access control (RBAC). I secure APIs with middleware, implement CORS properly, add rate limiting, and use industry best practices for protecting user data.',
    icon: '🔐',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=500&q=60'
  },
  {
    title: 'Deployment & DevOps',
    slug: 'deployment-devops',
    shortDescription: 'Deploying applications to production with CI/CD pipelines',
    fullContent: 'Deploying web applications to Vercel, Render, AWS, and other platforms. Setting up CI/CD pipelines with GitHub Actions, managing environment configurations, monitoring performance, and ensuring 24/7 uptime. I handle the complete deployment workflow.',
    icon: '⚙️',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=500&q=60'
  }
];

async function setupDashboard() {
  try {
    console.log('🚀 Starting Dashboard Setup...\n');

    // 1. Create or Update Admin User
    console.log('📝 Setting up Admin User...');
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
    
    const admin = await prisma.adminUser.upsert({
      where: { email: ADMIN_EMAIL },
      update: { password: hashedPassword, name: ADMIN_NAME },
      create: {
        email: ADMIN_EMAIL,
        password: hashedPassword,
        name: ADMIN_NAME
      }
    });
    console.log(`✅ Admin User Ready:`);
    console.log(`   Email: ${admin.email}`);
    console.log(`   Password: ${ADMIN_PASSWORD}\n`);

    // 2. Seed Projects
    console.log('📦 Adding Projects to Dashboard...');
    for (const project of projects) {
      const created = await prisma.project.upsert({
        where: { slug: project.slug },
        update: {
          title: project.title,
          description: project.description,
          content: project.content,
          image: project.image,
          images: project.images,
          link: project.link,
          tags: project.tags
        },
        create: project
      });
      console.log(`   ✅ ${created.title}`);
    }
    console.log('');

    // 3. Seed Services
    console.log('🛠️  Adding Services to Dashboard...');
    for (const service of services) {
      const created = await prisma.service.upsert({
        where: { slug: service.slug },
        update: {
          title: service.title,
          shortDescription: service.shortDescription,
          fullContent: service.fullContent,
          icon: service.icon,
          image: service.image
        },
        create: service
      });
      console.log(`   ✅ ${created.title}`);
    }
    console.log('');

    // 4. Get Statistics
    const projectCount = await prisma.project.count();
    const serviceCount = await prisma.service.count();
    const messageCount = await prisma.message.count();

    console.log('📊 Dashboard Statistics:');
    console.log(`   Projects: ${projectCount}`);
    console.log(`   Services: ${serviceCount}`);
    console.log(`   Messages: ${messageCount}\n`);

    console.log('✨ Dashboard Setup Complete!\n');
    console.log('📌 Login Credentials:');
    console.log(`   Email: ${ADMIN_EMAIL}`);
    console.log(`   Password: ${ADMIN_PASSWORD}`);
    console.log('\n🎯 Next Steps:');
    console.log('   1. Start the server: npm run dev');
    console.log('   2. Open: http://localhost:5173/admin');
    console.log('   3. Login with credentials above');
    console.log('   4. View projects and services in dashboard\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Setup Failed:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

setupDashboard();
