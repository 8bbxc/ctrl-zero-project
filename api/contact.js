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

  // DEBUG: log invocation details to help diagnose 405 issues in production
  try {
    console.log('contact.fn invoked', {
      method: req.method,
      url: req.url || req.path || '/',
      origin: req.headers?.origin,
      host: req.headers?.host,
      'content-type': req.headers?.['content-type']
    });
  } catch (e) {
    console.warn('contact.fn debug log failed', e && e.message);
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Normalize body: sometimes platforms deliver a string body
  let body = req.body || {};
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch (err) {
      console.warn('Contact: failed to parse string body');
    }
  }

  const { name, email, subject, message } = body || {};

  // DEBUG: small preview of the incoming body (do not log secrets)
  try {
    if (body && typeof body === 'object') {
      console.log('contact.body.preview', {
        name: body.name ? String(body.name).slice(0, 100) : undefined,
        email: body.email,
        subject: body.subject ? String(body.subject).slice(0, 120) : undefined,
        messageLength: body.message ? String(body.message).length : 0
      });
    } else {
      console.log('contact.body.type', typeof body);
    }
  } catch (e) {
    console.warn('contact.body preview failed', e && e.message);
  }

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

    if (telegramRes?.data?.ok) {
      console.log('Contact -> Telegram sent, message_id=', telegramRes.data.result?.message_id);
      return res.status(200).json({ ok: true, message_id: telegramRes.data.result?.message_id });
    }

    console.error('Unexpected Telegram response', telegramRes?.data);
    return res.status(502).json({ error: 'Failed to send message', details: telegramRes?.data });
  } catch (err) {
    console.error('Telegram API error:', err?.message || err);
    const status = err.response?.status || 500;
    const msg = err.response?.data || { error: 'Telegram API error' };
    return res.status(502).json({ error: 'Failed to send message', details: msg });
  }
};
