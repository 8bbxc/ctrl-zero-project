// server/seed-remote.js
require('dotenv').config();
// انتبه للمسار، ضعه حسب مكان ملف Prisma عندك
const { PrismaClient } = require('@prisma/client'); 
const bcrypt = require('bcrypt'); // تأكد أنها نفس المكتبة المستخدمة في auth.js (bcrypt أو bcryptjs)

const prisma = new PrismaClient();

async function main() {
  console.log('⏳ جاري الاتصال بقاعدة بيانات Render...');
  
  const email = 'yazan@info.com';
  const password = 'Yazan@2006.com'; 
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.adminUser.upsert({
      where: { email: email },
      update: {}, // إذا كان موجوداً لا تفعل شيئاً
      create: {
        email: email,
        password: hashedPassword,
        name: 'Admin',
      },
    });
    console.log('✅ تم إنشاء الأدمن بنجاح في قاعدة بيانات Render:', user);
  } catch (e) {
    console.error('❌ حدث خطأ:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();