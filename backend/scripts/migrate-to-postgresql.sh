#!/bin/bash

echo "🗄️  SQLite to PostgreSQL Migration Script"
echo "=========================================="

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ DATABASE_URL environment variable is not set"
    echo "   Please set your PostgreSQL connection string"
    echo "   Example: DATABASE_URL=postgresql://user:pass@host:port/db"
    exit 1
fi

echo "📋 Current DATABASE_URL:"
echo "   ${DATABASE_URL:0:50}..."

echo ""
echo "⚠️  WARNING: This will migrate your data from SQLite to PostgreSQL"
echo "   Make sure you have:"
echo "   1. Backed up your SQLite database"
echo "   2. PostgreSQL database is ready"
echo "   3. Correct DATABASE_URL is set"
echo ""

read -p "Continue with migration? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Migration cancelled"
    exit 1
fi

echo ""
echo "🔧 Starting migration process..."

# Step 1: Generate Prisma client for PostgreSQL
echo "1️⃣  Generating Prisma client for PostgreSQL..."
bun run db:prod:generate

# Step 2: Run migrations
echo "2️⃣  Running database migrations..."
bun run db:prod:migrate

# Step 3: Seed database (optional)
read -p "3️⃣  Do you want to seed the database? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "   Seeding database..."
    bun run db:seed
fi

echo ""
echo "✅ Migration completed!"
echo ""
echo "🔍 Verification:"
echo "   - Check database tables: bun run db:prod:studio"
echo "   - Test API endpoints"
echo "   - Verify data integrity"
echo ""
echo "🎯 Next steps:"
echo "   - Update your .env file with PostgreSQL DATABASE_URL"
echo "   - Test your application"
echo "   - Deploy to production"
