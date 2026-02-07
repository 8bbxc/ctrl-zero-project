// server/create-admin.js
require('dotenv').config(); // لقراءة رابط الداتابيز من .env
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs'); // تأكد أنها نفس المكتبة المستخدمة في auth.js (bcrypt أو bcryptjs)

const prisma = new PrismaClient();

async function main() {
  const email = 'yazan@info.com'; // إيميل الأدمن
  const password = '123';         // كلمة المرور التي تريدها
  
  // تشفير كلمة المرور (مهم جداً لأن السيرفر يقارن التشفير)
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.adminUser.create({
      data: {
        email: email,
        password: hashedPassword,
        // name: 'Yazan', // أضف الاسم إذا كان الحقل مطلوباً في الـ Schema
      },
    });
    console.log('✅ تم إنشاء حساب الأدمن بنجاح:', user);
  } catch (error) {
    if (error.code === 'P2002') {
      console.log('⚠️ هذا الحساب موجود بالفعل.');
    } else {
      console.error('❌ حدث خطأ:', error);
    }
  } finally {
    await prisma.$disconnect();
  }
}

main();