#!/bin/bash
# Post-build script for Render deployment
# Ensures Prisma client is regenerated with latest schema

echo "🔄 Regenerating Prisma Client..."
npx prisma generate

echo "✅ Prisma Client regenerated"
