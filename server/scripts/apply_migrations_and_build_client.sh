#!/usr/bin/env bash
set -euo pipefail

echo "🔍 Running deploy-fix script on: $(pwd)"

# Ensure DATABASE_URL exists
if [ -z "${DATABASE_URL:-}" ]; then
  echo "❌ ERROR: DATABASE_URL is not set in environment. Aborting."
  exit 1
fi

# 1) Apply Prisma migrations (deploy mode)
echo "
1/5 🔧 Applying Prisma migrations..."
cd "$(dirname "$0")/.."/ || cd ../
cd server || true
pwd
npx prisma migrate deploy --schema=./prisma/schema.prisma

# 2) Generate Prisma client
echo "2/5 📦 Generating Prisma client..."
npx prisma generate

# 3) Build client
echo "3/5 🛠️ Building client..."
cd ../client || true
npm ci --no-audit --no-fund
npm run build

# 4) Copy built client to server's expected static path
echo "4/5 📁 Copying client build to server/client/dist..."
mkdir -p ../server/client/dist
cp -R dist/* ../server/client/dist/

# 5) Finalize and suggest restart
echo "5/5 ✅ Done. Please restart the service or trigger a redeploy in Render to pick up the changes."

echo "To restart now (in container) you can run: kill -s SIGTERM 1  # Render will restart the service"

echo "
Next checks you can run after restart:
  curl -i https://<your-service-url>/api/projects
  curl -i https://<your-service-url>/api/services
  # Or check logs: render dashboard -> Logs"

exit 0
