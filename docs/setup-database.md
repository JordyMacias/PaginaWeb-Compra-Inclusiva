# Configurar PostgreSQL para CompraInclusiva

## Si no recuerdas la contraseña de postgres

### Opción A — Abre pgAdmin (instalado con PostgreSQL)
1. Busca "pgAdmin 4" en el menú inicio
2. Entra con la contraseña maestra
3. En el árbol de la izquierda: Servers → PostgreSQL 17 → Login/Group Roles → postgres
4. Haz clic derecho → Properties → Definition → cambia la contraseña

### Opción B — Resetear desde terminal de Administrador
Abre PowerShell **como Administrador** y ejecuta:

```powershell
cd "C:\Program Files\PostgreSQL\17\bin"

# Detener el servicio
.\pg_ctl.exe stop -D "C:\Program Files\PostgreSQL\17\data" -m fast

# Editar pg_hba.conf para desactivar la contraseña temporalmente
$file = "C:\Program Files\PostgreSQL\17\data\pg_hba.conf"
(Get-Content $file) -replace 'scram-sha-256', 'trust' | Set-Content $file

# Reiniciar el servicio
.\pg_ctl.exe start -D "C:\Program Files\PostgreSQL\17\data"

# Cambiar la contraseña (pon la que quieras en lugar de MiNuevaContraseña)
.\psql.exe -U postgres -c "ALTER USER postgres WITH PASSWORD 'MiNuevaContraseña';"

# Restaurar la seguridad (volver a scram-sha-256)
(Get-Content $file) -replace 'trust', 'scram-sha-256' | Set-Content $file

# Reiniciar de nuevo
.\pg_ctl.exe restart -D "C:\Program Files\PostgreSQL\17\data"
```

## Una vez que tengas la contraseña

### 1. Crear el archivo .env

```bash
# En la raíz del proyecto: C:\Users\Usuario\Desktop\CompraInclusiva\.env
DATABASE_URL="postgresql://postgres:TU_CONTRASEÑA@localhost:5432/comprainclusiva"
JWT_SECRET="secreto-super-seguro-de-al-menos-32-caracteres-cambiame"
JWT_EXPIRES_IN="7d"
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### 2. Crear la base de datos

```powershell
$env:PGPASSWORD = "TU_CONTRASEÑA"
& "C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -c "CREATE DATABASE comprainclusiva;"
```

### 3. Ejecutar migraciones y seed

```powershell
cd "C:\Users\Usuario\Desktop\CompraInclusiva\backend"
npx prisma generate
npx prisma migrate dev --name init
npx ts-node ..\database\seed.ts
```

### 4. Arrancar el backend

```powershell
npm run dev
# → API disponible en http://localhost:3001
```

### 5. Desactivar el modo mock en el frontend

En `frontend/src/services/products.ts`, cambia:
```typescript
export const USE_MOCK_DATA = false;  // ← cambiar de true a false
```

## Verificar que funciona

```powershell
# Test de salud del backend
Invoke-RestMethod http://localhost:3001/health

# Test de productos
Invoke-RestMethod http://localhost:3001/api/products
```
