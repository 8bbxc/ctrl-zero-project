const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { requireAuth } = require('../middleware/auth'); // حماية الراوت

// جلب كل الرسائل (الأحدث أولاً)
// جلب كل الرسائل (الأحدث أولاً) - محمي
router.get('/', requireAuth, async (req, res) => {
  try {
    const messages = await prisma.message.findMany({
      orderBy: { createdAt: 'desc' }
    });
    
    // ننسق البيانات لتناسب تصميم الداشبورد الموحد
    const formattedMessages = messages.map(msg => ({
      id: msg.id,
      name: msg.name,              // اسم المرسل
      email: msg.email,            // بريد المرسل (مهم للداشبورد)
      subject: msg.subject,        // الموضوع
      message: msg.message,        // محتوى الرسالة
      fullContent: msg.message,    // المحتوى الكامل
      date: msg.createdAt,
      createdAt: msg.createdAt,
      type: 'message'              // تمييز النوع
    }));

    res.json(formattedMessages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Public minimal messages list (no auth) - suitable for listing only
router.get('/public', async (req, res) => {
  try {
    const messages = await prisma.message.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        subject: true,
        createdAt: true
      }
    });

    res.json(messages);
  } catch (error) {
    console.error('Public messages fetch error:', error.message || error);
    res.status(500).json({ error: 'Failed to fetch public messages' });
  }
});

// حذف رسالة
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid id' });

    // نتأكد أن الرسالة موجودة قبل الحذف لتقديم خطأ واضح
    const existing = await prisma.message.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: 'Message not found' });

    await prisma.message.delete({ where: { id } });
    res.json({ success: true });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({ error: 'Failed to delete' });
  }
});

module.exports = router;