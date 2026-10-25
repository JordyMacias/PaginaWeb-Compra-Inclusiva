# =====================================================
# SCRIPT DE CONFIGURACIÓN DE CompraInclusiva
# Ejecutar con: .\setup.ps1
# Requiere: PostgreSQL 17 corriendo y la contraseña del usuario postgres
# =====================================================

Write-Host ""
Write-Host "╔═══════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║     CompraInclusiva — Setup           ║" -ForegroundColor Cyan
Write-Host "╚═══════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# --- Solicitar contraseña de postgres ---
$pgPassword = Read-Host -Prompt "Introduce la contraseña de tu usuario PostgreSQL (usuario: postgres)" -AsSecureString
$pgPasswordPlain = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto(
    [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($pgPassword)
)

# --- Verificar conexión ---
Write-Host "`n🔍 Verificando conexión a PostgreSQL..." -ForegroundColor Yellow
$env:PGPASSWORD = $pgPasswordPlain
$env:PATH += ";C:\Program Files\PostgreSQL\17\bin"

$testResult = & "C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -c "SELECT 1 AS ok;" 2>&1
if ($testResult -notmatch "ok") {
    Write-Host "❌ No se pudo conectar a PostgreSQL. Verifica la contraseña." -ForegroundColor Red
    Write-Host "   Consulta docs\setup-database.md para instrucciones de recuperación." -ForegroundColor Red
    exit 1
}
Write-Host "✅ Conexión a PostgreSQL exitosa." -ForegroundColor Green

# --- Crear base de datos ---
Write-Host "`n📦 Creando base de datos 'comprainclusiva'..." -ForegroundColor Yellow
$createDb = & "C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -c "CREATE DATABASE comprainclusiva;" 2>&1
if ($createDb -match "already exists") {
    Write-Host "ℹ️  La base de datos ya existe, continuando..." -ForegroundColor Blue
} elseif ($createDb -match "CREATE DATABASE") {
    Write-Host "✅ Base de datos creada." -ForegroundColor Green
} else {
    Write-Host "⚠️  $createDb" -ForegroundColor Yellow
}

# --- Crear .env ---
Write-Host "`n📝 Creando archivo .env..." -ForegroundColor Yellow
$envContent = @"
# Base de datos
DATABASE_URL="postgresql://postgres:$pgPasswordPlain@localhost:5432/comprainclusiva"

# JWT - CAMBIA ESTE SECRETO EN PRODUCCIÓN
JWT_SECRET="compra-inclusiva-secreto-desarrollo-2024-cambia-en-prod"
JWT_EXPIRES_IN="7d"

# Servidor
PORT=3001
NODE_ENV=development

# Frontend
FRONTEND_URL=http://localhost:5173

# Stripe (modo test - opcional)
STRIPE_SECRET_KEY=sk_test_
STRIPE_PUBLISHABLE_KEY=pk_test_
"@

$envPath = Join-Path $PSScriptRoot ".env"
$envContent | Set-Content $envPath -Encoding UTF8
Write-Host "✅ Archivo .env creado en $envPath" -ForegroundColor Green

# --- Instalar dependencias del backend ---
Write-Host "`n📦 Instalando dependencias del backend..." -ForegroundColor Yellow
Set-Location (Join-Path $PSScriptRoot "backend")
npm install --legacy-peer-deps --silent 2>&1 | Out-Null
Write-Host "✅ Dependencias instaladas." -ForegroundColor Green

# --- Generar cliente Prisma ---
Write-Host "`n🔧 Generando cliente Prisma..." -ForegroundColor Yellow
npx prisma generate 2>&1 | Out-Null
Write-Host "✅ Cliente Prisma generado." -ForegroundColor Green

# --- Ejecutar migraciones ---
Write-Host "`n🗄️  Ejecutando migraciones de base de datos..." -ForegroundColor Yellow
$migrateResult = npx prisma migrate dev --name init 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Migraciones aplicadas." -ForegroundColor Green
} else {
    Write-Host "❌ Error en migraciones:" -ForegroundColor Red
    Write-Host $migrateResult
    exit 1
}

# --- Ejecutar seed ---
Write-Host "`n🌱 Cargando datos de demostración..." -ForegroundColor Yellow
$seedResult = npx ts-node ..\database\seed.ts 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Datos de demostración cargados." -ForegroundColor Green
} else {
    Write-Host "⚠️  Error en el seed (puedes continuar sin datos demo):" -ForegroundColor Yellow
    Write-Host $seedResult
}

# --- Desactivar modo mock del frontend ---
Write-Host "`n🔄 Activando conexión real con el backend..." -ForegroundColor Yellow
$productsServicePath = Join-Path $PSScriptRoot "frontend\src\services\products.ts"
(Get-Content $productsServicePath) -replace 'export const USE_MOCK_DATA = true', 'export const USE_MOCK_DATA = false' | Set-Content $productsServicePath
Write-Host "✅ Frontend configurado para usar el backend real." -ForegroundColor Green

Set-Location $PSScriptRoot

Write-Host ""
Write-Host "╔═══════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║  ✅ Configuración completada exitosamente          ║" -ForegroundColor Green
Write-Host "╚═══════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
Write-Host "Para arrancar la aplicación, abre DOS terminales:" -ForegroundColor White
Write-Host ""
Write-Host "  Terminal 1 — Backend:" -ForegroundColor Cyan
Write-Host "    cd backend" -ForegroundColor Gray
Write-Host "    npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "  Terminal 2 — Frontend:" -ForegroundColor Cyan  
Write-Host "    cd frontend" -ForegroundColor Gray
Write-Host "    npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "  Luego abre: http://localhost:5173" -ForegroundColor Yellow
Write-Host ""
Write-Host "  Credenciales de demo:" -ForegroundColor White
Write-Host "    Usuario:  usuario@demo.es    / Usuario1234!" -ForegroundColor Gray
Write-Host "    Admin:    admin@comprainclusiva.es / Admin1234!" -ForegroundColor Gray
Write-Host ""
