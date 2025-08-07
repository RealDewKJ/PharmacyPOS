#!/bin/bash

# Pharmacy POS Installation Script for Unix-based systems
echo "🚀 Setting up Pharmacy POS System..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if Bun is installed
if ! command -v bun &> /dev/null; then
    echo "📦 Installing Bun..."
    curl -fsSL https://bun.sh/install | bash
    source ~/.bashrc
fi

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
cd ..

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
bun install
cd ..

# Create environment files
echo "⚙️ Creating environment files..."
cp backend/env.example backend/.env 2>/dev/null || true

# Setup database
echo "🗄️ Setting up database..."
cd backend
bun run db:generate
bun run db:push
bun run db:seed
cd ..

echo "✅ Installation completed!"
echo ""
echo "🎉 To start the application:"
echo "   npm run dev"
echo ""
echo "📱 Frontend will be available at: http://localhost:3000"
echo "🔧 Backend API will be available at: http://localhost:3001"
echo "📚 API Documentation will be available at: http://localhost:3001/docs"
echo ""
echo "🔑 Default login credentials:"
echo "   Email: admin@pharmacy.com"
echo "   Password: admin123"
