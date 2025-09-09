@echo off
echo Quick Development Setup (SQLite)
echo ===============================

REM Copy development env file
if exist "env.development" (
    copy "env.development" ".env" >nul
    echo Copied env.development to .env
) else (
    echo env.development file not found
    exit /b 1
)

REM Push schema to SQLite with force reset (skip Prisma client generation)
echo Pushing schema to SQLite database...
call npx prisma db push --schema=./prisma/schema.prisma --force-reset

echo.
echo Development environment ready!
echo   Database: SQLite (dev.db)
echo   API: http://localhost:3001
echo.
echo Next steps:
echo   - Start development: bun run dev
echo   - Open Prisma Studio: npx prisma studio
echo   - Test API: curl http://localhost:3001/health
echo.
echo Note: If you need Prisma client, run manually:
echo   - npx prisma generate (as Administrator)
echo   - or restart your IDE/terminal
