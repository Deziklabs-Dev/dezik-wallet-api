# Guía de Configuración Rápida

## 1. Configurar Base de Datos PostgreSQL

Asegúrate de tener PostgreSQL instalado y ejecutándose. Luego edita el archivo `.env`:

```env
DATABASE_URL="postgresql://tu_usuario:tu_password@localhost:5432/digital_wallet?schema=public"
```

## 2. Ejecutar Migraciones

```bash
npm run prisma:migrate
```

Cuando se te pregunte el nombre de la migración, puedes usar: `init`

## 3. Crear Usuario Admin

```bash
npm run prisma:seed
```

Esto creará un usuario administrador con:
- Email: admin@example.com
- Password: admin123456

## 4. Iniciar el Servidor

```bash
npm run start:dev
```

El servidor estará disponible en: `http://localhost:3000/api`

## 5. Probar la API

### Login:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123456"}' \
  -c cookies.txt
```

### Ver Perfil:
```bash
curl http://localhost:3000/api/auth/profile \
  -b cookies.txt
```

### Crear Usuario (como admin):
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123","role":"USER"}' \
  -b cookies.txt
```

## Notas Importantes

- Las cookies se manejan automáticamente
- El JWT está en una cookie HTTP-only (no accesible desde JavaScript)
- Solo los administradores pueden crear usuarios
- Cambia las credenciales por defecto en producción
