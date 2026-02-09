// 🧪 Test file to verify database connectivity and project update
// Run with: node test-update.js

require('dotenv').config();
const prisma = require('./src/utils/prisma');

async function testProjectUpdate() {
  try {
    console.log('🔍 Testing Project Update...\n');

    // Test 1: Check database connection
    console.log('1️⃣  Checking database connection...');
    const health = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('   ✅ Database connection OK\n');

    // Test 2: Get all projects
    console.log('2️⃣  Fetching projects...');
    const projects = await prisma.project.findMany({ take: 5 });
    console.log(`   ✅ Found ${projects.length} projects`);
    if (projects.length > 0) {
      console.log(`   First project: ID=${projects[0].id}, slug=${projects[0].slug}\n`);
    }

    // Test 3: Test update with minimal data
    if (projects.length > 0) {
      const testProject = projects[0];
      console.log(`3️⃣  Testing update on project ID=${testProject.id}...`);
      
      try {
        const updated = await prisma.project.update({
          where: { id: testProject.id },
          data: {
            title: `Test Update - ${new Date().toISOString()}`,
            slug: testProject.slug, // Keep same slug to avoid conflicts
            description: 'Test description',
            content: 'Test content',
            tags: ['test'],
            gallery: []
          }
        });
        console.log('   ✅ Update successful!');
        console.log(`   Updated: title="${updated.title}"\n`);
      } catch (error) {
        console.error('   ❌ Update failed:');
        console.error('   Error:', error.message);
        console.error('   Code:', error.code);
        if (error.meta) console.error('   Meta:', error.meta);
      }
    }

  } catch (error) {
    console.error('❌ Test Error:', error.message);
  } finally {
    await prisma.$disconnect();
    console.log('\n✅ Test complete');
  }
}

testProjectUpdate();
