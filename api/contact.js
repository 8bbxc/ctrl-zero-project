const axios = require('axios');

// Escape text for Telegram MarkdownV2
function escapeMarkdown(text = '') {
  return String(text).replace(/([_\*\[\]\(\)~`>#\+\-\=\|\{\}\.\\!\\\\])/g, '\\$1');
}

function setCorsHeaders(res) {
  // Allow all origins for simplicity; restrict in production if needed
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

module.exports = async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    setCorsHeaders(res);
    return res.status(204).end();
  }

  setCorsHeaders(res);

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { name, email, subject, message } = req.body || {};

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'Missing required fields: name, email, subject, message' });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.error('Telegram credentials missing');
    return res.status(500).json({ error: 'Server misconfiguration' });
  }

  const text = `*New Contact Message*\n` +
    `*Name:* ${escapeMarkdown(name)}\n` +
    `*Email:* ${escapeMarkdown(email)}\n` +
    `*Subject:* ${escapeMarkdown(subject)}\n` +
    `*Message:*\n${escapeMarkdown(message)}`;

  try {
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const payload = {
      chat_id: chatId,
      text,
      parse_mode: 'MarkdownV2'
    };

    const telegramRes = await axios.post(url, payload, { timeout: 10000 });
    if (telegramRes.data && telegramRes.data.ok) {
      return res.status(200).json({ ok: true });
    }

    console.error('Unexpected Telegram response', telegramRes.data);
    return res.status(500).json({ error: 'Failed to send message' });
  } catch (err) {
    console.error('Telegram API error:', err.message || err);
    const status = err.response?.status || 500;
    const msg = err.response?.data || { error: 'Telegram API error' };
    return res.status(500).json({ error: 'Failed to send message', details: msg });
  }
};
