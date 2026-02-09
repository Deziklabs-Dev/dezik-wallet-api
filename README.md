# Backend Digital Wallet - Sistema de Autenticación

Sistema de autenticación backend con NestJS, Prisma, PostgreSQL y JWT con cookies seguras.

## 🚀 Características

- ✅ Autenticación con JWT almacenado en cookies HTTP-only
- ✅ Control de acceso basado en roles (Admin/Usuario)
- ✅ Solo administradores pueden crear usuarios
- ✅ Encriptación de contraseñas con bcrypt
- ✅ Integración con PostgreSQL usando Prisma ORM
- ✅ Validación de datos con class-validator
- ✅ CORS configurado para frontend
- ✅ Sin uso de localStorage (máxima seguridad)

## 📋 Requisitos Previos

- Node.js (v18 o superior)
- PostgreSQL (v14 o superior)
- npm o pnpm

## 🔧 Instalación Rápida

1. **Instalar dependencias:**
```bash
npm install
```

2. **Configurar variables de entorno:**
Edita el archivo `.env` con tus datos de PostgreSQL:
```env
DATABASE_URL="postgresql://tu_usuario:tu_password@localhost:5432/digital_wallet?schema=public"
JWT_SECRET="tu-clave-secreta-jwt-muy-segura"
JWT_EXPIRES_IN="7d"
PORT=3000
NODE_ENV="development"
FRONTEND_URL="http://localhost:3001"
```

3. **Generar Prisma Client:**
```bash
npm run prisma:generate
```

4. **Crear la base de datos:**
```bash
npm run prisma:migrate
```
Nombre de migración sugerido: `init`

5. **Crear usuario admin:**
```bash
npm run prisma:seed
```

Credenciales por defecto:
- **Email:** admin@example.com
- **Password:** admin123456

6. **Iniciar servidor:**
```bash
npm run start:dev
```

Servidor disponible en: `http://localhost:3000/api`

## 📚 Endpoints Principales

### Autenticación
- `POST /api/auth/login` - Iniciar sesión (devuelve cookie con JWT)
- `POST /api/auth/logout` - Cerrar sesión (limpia cookie)
- `GET /api/auth/profile` - Obtener perfil del usuario autenticado
- `POST /api/auth/register` - Registrar usuario (solo admin)

### Gestión de Usuarios (Solo Admin)
- `GET /api/users` - Listar todos los usuarios
- `GET /api/users/:id` - Obtener usuario por ID
- `POST /api/users` - Crear usuario
- `PATCH /api/users/:id` - Actualizar usuario
- `DELETE /api/users/:id` - Eliminar usuario

Ver [API_ENDPOINTS.md](./API_ENDPOINTS.md) para ejemplos detallados.

## 🏗️ Estructura del Proyecto

```
src/
├── auth/                    # Módulo de autenticación
│   ├── decorators/         # @Roles, @CurrentUser
│   ├── dto/                # Validación de datos
│   ├── guards/             # JWT y Roles guards
│   ├── strategies/         # JWT strategy con cookies
│   └── auth.module.ts
├── users/                   # Módulo de usuarios
│   ├── dto/
│   └── users.module.ts
├── prisma/                  # Módulo de Prisma
│   └── prisma.module.ts
└── main.ts                 # Configuración principal
```

## 🔒 Seguridad

- **JWT en cookies HTTP-only:** No accesibles desde JavaScript
- **Secure flag:** Solo HTTPS en producción
- **SameSite:** Protección CSRF
- **Bcrypt:** Hash de contraseñas
- **Validación:** class-validator en todos los DTOs

## 🗄️ Base de Datos

```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  role      Role     @default(USER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum Role {
  ADMIN
  USER
}
```

## 🧪 Comandos Útiles

```bash
# Desarrollo
npm run start:dev

# Producción
npm run build
npm run start:prod

# Prisma
npm run prisma:generate    # Generar cliente
npm run prisma:migrate     # Crear migración
npm run prisma:studio      # Abrir Prisma Studio
npm run prisma:seed        # Ejecutar seed
npm run prisma:reset       # Limpiar DB

# Tests
npm run test
npm run test:e2e
npm run test:cov
```

## 📝 Notas Importantes

### Configuración del Frontend
Asegúrate de enviar credenciales con las peticiones:

```javascript
fetch('http://localhost:3000/api/auth/login', {
  method: 'POST',
  credentials: 'include', // IMPORTANTE!
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ email, password })
})
```

### Roles
- Solo usuarios con rol `ADMIN` pueden crear otros usuarios
- Las cookies se configuran automáticamente en login
- Las cookies se limpian automáticamente en logout

### Producción
- Cambia `JWT_SECRET` y `COOKIE_SECRET`
- Cambia credenciales del admin por defecto
- Configura `NODE_ENV=production`
- Usa HTTPS para cookies seguras

## 📄 Documentación Adicional

- [SETUP_GUIDE.md](./SETUP_GUIDE.md) - Guía de configuración paso a paso
- [API_ENDPOINTS.md](./API_ENDPOINTS.md) - Documentación completa de la API

## 📄 Licencia

UNLICENSED
