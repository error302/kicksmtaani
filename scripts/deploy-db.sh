#!/bin/bash
# KicksMtaani — Production Database Setup Script
# Run this ONCE locally (not on Vercel) to create all tables and seed data
# in your Prisma Postgres / Neon / Supabase / Vercel Postgres database.
#
# Usage:
#   DATABASE_URL="postgresql://..." bash scripts/deploy-db.sh
#
# Or set DATABASE_URL in your .env file first, then:
#   bash scripts/deploy-db.sh

set -e

cd "$(dirname "$0")/.."

echo "========================================"
echo "  KicksMtaani — Database Deployment"
echo "========================================"
echo ""

# Check DATABASE_URL
if [ -z "$DATABASE_URL" ]; then
  if [ -f .env ]; then
    export $(grep -v '^#' .env | grep DATABASE_URL | xargs)
  fi
fi

if [ -z "$DATABASE_URL" ]; then
  echo "❌ DATABASE_URL not set."
  echo ""
  echo "Set it in your .env file or pass it directly:"
  echo "  DATABASE_URL='postgresql://...' bash scripts/deploy-db.sh"
  exit 1
fi

# Mask the URL for display
MASKED_URL=$(echo "$DATABASE_URL" | sed 's/:[^:@]*@/:****@/')
echo "📍 Database: $MASKED_URL"
echo ""

# Step 1: Generate Prisma Client
echo "1️⃣  Generating Prisma Client..."
npx prisma generate
echo ""

# Step 2: Push schema to database (creates all tables)
echo "2️⃣  Pushing schema to database (creates tables)..."
npx prisma db push --accept-data-loss
echo ""

# Step 3: Seed products and brands
echo "3️⃣  Seeding products and brands..."
node scripts/seed.js 2>/dev/null || npx tsx scripts/seed.ts 2>/dev/null || bun scripts/seed.ts
echo ""

# Step 4: Seed admin user
echo "4️⃣  Creating admin user..."
node scripts/seed-admin.js 2>/dev/null || npx tsx scripts/seed-admin.ts 2>/dev/null || bun scripts/seed-admin.ts
echo ""

echo "========================================"
echo "  ✅ Database deployment complete!"
echo "========================================"
echo ""
echo "Admin login:"
echo "  Email: admin@kicksmtaani.co.ke"
echo "  Password: admin12345"
echo ""
echo "Your Vercel deployment should now work."
echo "Make sure DATABASE_URL is set in Vercel → Settings → Environment Variables."
