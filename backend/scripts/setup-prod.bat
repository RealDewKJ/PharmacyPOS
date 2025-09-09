@echo off
echo Setting up Production Environment (PostgreSQL)
echo =============================================

REM Check if production env file exists
if not exist "env.production.example" (
    echo env.production.example file not found
    echo Please copy env.production.example to .env and configure it
    exit /b 1
)

echo Please configure your production environment:
echo   1. Copy env.production.example to .env
echo   2. Update DATABASE_URL with your PostgreSQL connection
echo   3. Update JWT_SECRET with a strong secret
echo   4. Update CORS_ORIGIN with your frontend domain
echo.
echo Then run: bun run db:prod:generate
echo And: bun run db:prod:migrate
echo.
pause
