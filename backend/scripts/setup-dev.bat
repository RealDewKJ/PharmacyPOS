@echo off
echo Setting up Development Environment (SQLite)
echo ==========================================

REM Copy development env file
if exist "env.development" (
    copy "env.development" ".env" >nul
    echo Copied env.development to .env
) else (
    echo env.development file not found
    exit /b 1
)

REM Remove existing Prisma client to avoid permission issues
if exist "node_modules\.prisma" (
    rmdir /s /q "node_modules\.prisma" 2>nul
    echo Cleaned existing Prisma client
)

REM Generate Prisma client
echo Generating Prisma client for SQLite...
call bun run db:generate

REM Push schema to SQLite with force reset
echo Pushing schema to SQLite database...
call bun run db:dev:push

echo.
echo Development environment ready!
echo   Database: SQLite (dev.db)
echo   API: http://localhost:3001
echo   Studio: bun run db:dev:studio
echo.
echo Next steps:
echo   - Start development: bun run dev
echo   - Open Prisma Studio: bun run db:studio
echo   - Test API: curl http://localhost:3001/health
