# Pharmacy POS Installation Script for Windows
Write-Host "🚀 Setting up Pharmacy POS System..." -ForegroundColor Green

# Check if Node.js is installed
if (!(Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js is not installed. Please install Node.js 18+ first." -ForegroundColor Red
    exit 1
}

# Check if Bun is installed
if (!(Get-Command bun -ErrorAction SilentlyContinue)) {
    Write-Host "📦 Installing Bun..." -ForegroundColor Yellow
    powershell -c "irm bun.sh/install.ps1 | iex"
}

# Install root dependencies
Write-Host "📦 Installing root dependencies..." -ForegroundColor Yellow
npm install

# Install frontend dependencies
Write-Host "📦 Installing frontend dependencies..." -ForegroundColor Yellow
cd frontend
npm install
cd ..

# Install backend dependencies
Write-Host "📦 Installing backend dependencies..." -ForegroundColor Yellow
cd backend
bun install
cd ..

# Create environment files
Write-Host "⚙️ Creating environment files..." -ForegroundColor Yellow
Copy-Item "backend/env.example" "backend/.env" -ErrorAction SilentlyContinue

# Setup database
Write-Host "🗄️ Setting up database..." -ForegroundColor Yellow
cd backend
bun run db:generate
bun run db:push
bun run db:seed
cd ..

Write-Host "✅ Installation completed!" -ForegroundColor Green
Write-Host ""
Write-Host "🎉 To start the application:" -ForegroundColor Cyan
Write-Host "   npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "📱 Frontend will be available at: http://localhost:3000" -ForegroundColor White
Write-Host "🔧 Backend API will be available at: http://localhost:3001" -ForegroundColor White
Write-Host "📚 API Documentation will be available at: http://localhost:3001/docs" -ForegroundColor White
Write-Host ""
Write-Host "🔑 Default login credentials:" -ForegroundColor Cyan
Write-Host "   Email: admin@pharmacy.com" -ForegroundColor White
Write-Host "   Password: admin123" -ForegroundColor White
