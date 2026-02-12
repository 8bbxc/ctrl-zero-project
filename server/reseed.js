#!/usr/bin/env node

/**
 * Database Cleanup Script
 * Clears all existing projects - ready for new projects via code-based management
 * Projects are now managed via code commits, not admin UI
 * Usage: node reseed.js
 */

require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function clearDatabase() {
  try {
    console.log('🧹 Clearing all projects from database...');

    // Clear existing projects
    const deletedCount = await prisma.project.deleteMany({});
    console.log(`✅ Deleted ${deletedCount.count} projects`);

    const totalCount = await prisma.project.count();
    console.log(`📊 Database is now clean. Total projects: ${totalCount}`);
    console.log('✨ Ready for new projects via code-based management!')
    console.log('📝 Add projects by updating seed data and running migrations')

    process.exit(0);
  } catch (err) {
    console.error('❌ Error clearing database:', err.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

clearDatabase();
