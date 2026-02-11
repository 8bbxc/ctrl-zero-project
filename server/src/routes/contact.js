const express = require('express');
const router = express.Router();
// ⚠️ تعديل هام: استخدام النسخة المشتركة لمنع مشاكل الاتصال
const prisma = require('../utils/prisma'); 
const nodemailer = require('nodemailer');
const axios = require('axios');

// Helper to escape Telegram MarkdownV2
function escapeMarkdown(text = '') {
  return String(text).replace(/([_\*\[\]\(\)~`>#\+\-\=\|\{\}\.\\!\\\\])/g, '\\$1');
}

router.post('/', async (req, res) => {
  try {
    // 1. استقبال البيانات بذكاء (يدعم جميع التسميات المحتملة من الفرونت إند)
    const { 
      name, fullName, full_name, 
      email, emailAddress, 
      subject, title, 
      message, msg, description 
    } = req.body;

    // 2. توحيد البيانات (Data Normalization)
    const finalData = {
      name: name || fullName || full_name || 'Anonymous',
      email: email || emailAddress || 'No Email',
      subject: subject || title || 'No Subject',
      message: message || msg || description || ''
    };

    // التحقق من الحقول الإجبارية
    if (!finalData.message.trim()) {
      return res.status(400).json({ error: 'Message content is required' });
    }

    // 3. الحفظ في قاعدة البيانات (للداشبورد)
    const newMessage = await prisma.message.create({
      data: {
        name: finalData.name,
        email: finalData.email,
        subject: finalData.subject,
        message: finalData.message,
        read: false
      }
    });

    // 4. إرسال إشعار عبر الإيميل (Nodemailer) - اختياري
    if (process.env.SMTP_HOST && process.env.SMTP_USER) {
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT) || 587,
          secure: false,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });

        await transporter.sendMail({
          from: `"CTRL ZERO Contact" <${process.env.SMTP_USER}>`,
          to: process.env.DEFAULT_CONTACT_EMAIL || process.env.SMTP_USER, // إيميلك الشخصي
          subject: `📩 New Message: ${finalData.subject}`,
          text: `You received a new message from your website:\n\nName: ${finalData.name}\nEmail: ${finalData.email}\nSubject: ${finalData.subject}\n\nMessage:\n${finalData.message}`,
        });
        console.log('✅ Email notification sent.');
      } catch (emailErr) {
        console.warn('⚠️ Email failed, but message saved to DB:', emailErr.message);
      }
    }

    // 5. إرسال إشعار عبر تيليغرام (بدون انتظار - async in background)
    // لا نحتاج إلى انتظار النتيجة لأن المستخدم لا يحتاج إليها
    if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
      (async () => {
        try {
          const botToken = process.env.TELEGRAM_BOT_TOKEN;
          const chatId = process.env.TELEGRAM_CHAT_ID;
          const text = `*New Contact Message*\n` +
            `*Name:* ${escapeMarkdown(finalData.name)}\n` +
            `*Email:* ${escapeMarkdown(finalData.email)}\n` +
            `*Subject:* ${escapeMarkdown(finalData.subject)}\n` +
            `*Message:*\n${escapeMarkdown(finalData.message)}`;

          const tgRes = await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            chat_id: chatId,
            text,
            parse_mode: 'MarkdownV2'
          }, { timeout: 10000 });

          if (tgRes?.data?.ok) {
            console.log('✅ Telegram notification sent, message_id=', tgRes.data.result?.message_id);
          } else {
            console.warn('⚠️ Telegram did not accept message', tgRes?.data);
          }
        } catch (tgErr) {
          console.warn('⚠️ Telegram notification failed:', tgErr?.message || tgErr);
        }
      })();
    }

    // 6. الرد بنجاح فوراً (بدون انتظار Telegram)
    res.status(201).json({ success: true, message: 'Message sent successfully', data: newMessage });

  } catch (err) {
    console.error('❌ Contact Route Error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;