require('dotenv').config();
// انتبه: قد تحتاج تعديل المسار حسب مكان ملف prisma عندك (../lib/prisma أو ../utils/prisma)
// جرب المسار الموجود في كودك الأصلي
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt'); // أو bcryptjs حسب ما هو مثبت عندك

const prisma = new PrismaClient();

async function main() {
  console.log('⏳ جاري الاتصال بقاعدة Render...');
  
  const email = 'yazan@info.com';
  const password = 'Yazan@2006.com'; // كلمة المرور
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.adminUser.create({
      data: {
        email,
        password: hashedPassword,
        name: 'Admin'
      }
    });
    console.log('✅ تم إنشاء الأدمن بنجاح على السيرفر:', user);
  } catch (e) {
    if (e.code === 'P2002') {
      console.log('⚠️ المستخدم موجود مسبقاً.');
    } else {
      console.error('❌ حدث خطأ:', e);
    }
  } finally {
    await prisma.$disconnect();
  }
}

main();