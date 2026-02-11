const prisma = require('./prisma');

// Simple in-memory cache to avoid querying information_schema on every request
const cache = new Map();
const CACHE_TTL = 60 * 1000; // 60 seconds

async function getTableColumns(tableName) {
  const key = String(tableName);
  const now = Date.now();
  const cached = cache.get(key);
  if (cached && (now - cached.ts) < CACHE_TTL) {
    return cached.columns;
  }

  try {
    // Use lower-case comparison to be robust to quoted/unquoted table names
    const rows = await prisma.$queryRaw`
      SELECT column_name
      FROM information_schema.columns
      WHERE lower(table_name) = lower(${key})
    `;

    const cols = new Set(rows.map(r => r.column_name));
    cache.set(key, { ts: now, columns: cols });
    return cols;
  } catch (err) {
    console.error('Failed to fetch table columns for', tableName, err.message || err);
    // On failure, return an empty set to force safe fallback
    return new Set();
  }
}

module.exports = { getTableColumns };
