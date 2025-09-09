#!/bin/bash

echo "🗄️  Database Migration Script"
echo "=============================="

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ DATABASE_URL environment variable is not set"
    echo "   Please set it before running migrations"
    exit 1
fi

echo "📋 Current DATABASE_URL:"
echo "   ${DATABASE_URL:0:50}..."

echo ""
echo "🔧 Running database migrations..."

# Generate Prisma client
echo "1️⃣  Generating Prisma client..."
bun run db:generate

# Run migrations
echo "2️⃣  Running database migrations..."
bun run db:migrate

# Seed database (optional)
read -p "3️⃣  Do you want to seed the database? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "   Seeding database..."
    bun run db:seed
fi

echo ""
echo "✅ Database migration completed!"
echo ""
echo "🔍 Verification:"
echo "   - Check database tables: bun run db:studio"
echo "   - Test API endpoints"
echo "   - Verify data integrity"
