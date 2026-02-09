# 📘 Guía de Uso de Endpoints

## ⚠️ Error Común: Método HTTP Incorrecto

### ❌ Error que estás viendo:
```json
{
  "message": "Cannot GET /api/auth/register",
  "error": "Not Found",
  "statusCode": 404
}
```

### 🔍 Causa del Error:
Estás usando **GET** cuando el endpoint requiere **POST**.

---

## 📋 Endpoints y Métodos HTTP Correctos

### 1. Login (POST, no GET)
```bash
# ❌ INCORRECTO
curl http://localhost:3005/api/auth/login

# ✅ CORRECTO
curl -X POST http://localhost:3005/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123456"}' \
  -c cookies.txt
```

### 2. Registro (POST, no GET)
```bash
# ❌ INCORRECTO
curl http://localhost:3005/api/auth/register

# ✅ CORRECTO (requiere estar logueado como admin)
curl -X POST http://localhost:3005/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123","role":"USER"}' \
  -b cookies.txt
```

### 3. Logout (POST, no GET)
```bash
# ❌ INCORRECTO
curl http://localhost:3005/api/auth/logout

# ✅ CORRECTO
curl -X POST http://localhost:3005/api/auth/logout \
  -b cookies.txt
```

### 4. Perfil (GET - Este sí es GET)
```bash
# ✅ CORRECTO
curl http://localhost:3005/api/auth/profile \
  -b cookies.txt
```

### 5. Listar Usuarios (GET - Admin only)
```bash
# ✅ CORRECTO
curl http://localhost:3005/api/users \
  -b cookies.txt
```

### 6. Crear Usuario (POST - Admin only)
```bash
# ✅ CORRECTO
curl -X POST http://localhost:3005/api/users \
  -H "Content-Type: application/json" \
  -d '{"email":"new@example.com","password":"pass123","role":"USER"}' \
  -b cookies.txt
```

---

## 🌐 Usando Postman o Insomnia

### Login
- **Método:** POST
- **URL:** `http://localhost:3005/api/auth/login`
- **Headers:** `Content-Type: application/json`
- **Body (raw JSON):**
```json
{
  "email": "admin@example.com",
  "password": "admin123456"
}
```
- **Importante:** Habilita "Save cookies" para que se guarde el JWT

### Registro (después de login)
- **Método:** POST (no GET)
- **URL:** `http://localhost:3005/api/auth/register`
- **Headers:** `Content-Type: application/json`
- **Body (raw JSON):**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "role": "USER"
}
```
- **Importante:** Usa las cookies del login anterior

### Ver Perfil
- **Método:** GET
- **URL:** `http://localhost:3005/api/auth/profile`
- **Headers:** Ninguno adicional (usa cookies automáticamente)

---

## 📊 Tabla de Referencia Rápida

| Endpoint | Método | Auth Requerida | Rol Requerido |
|----------|--------|----------------|---------------|
| `/api` | GET | No | - |
| `/api/auth/login` | **POST** | No | - |
| `/api/auth/logout` | **POST** | Sí | - |
| `/api/auth/profile` | GET | Sí | - |
| `/api/auth/register` | **POST** | Sí | ADMIN |
| `/api/users` | GET | Sí | ADMIN |
| `/api/users` | **POST** | Sí | ADMIN |
| `/api/users/:id` | GET | Sí | ADMIN |
| `/api/users/:id` | PATCH | Sí | ADMIN |
| `/api/users/:id` | DELETE | Sí | ADMIN |

---

## 🔑 Flujo Completo de Uso

### Paso 1: Login
```bash
curl -X POST http://localhost:3005/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123456"}' \
  -c cookies.txt -v
```

**Respuesta esperada:**
```json
{
  "message": "Login successful",
  "user": {
    "id": "...",
    "email": "admin@example.com",
    "role": "ADMIN"
  }
}
```

### Paso 2: Ver Perfil (verificar que estás logueado)
```bash
curl http://localhost:3005/api/auth/profile -b cookies.txt
```

**Respuesta esperada:**
```json
{
  "id": "...",
  "email": "admin@example.com",
  "role": "ADMIN"
}
```

### Paso 3: Crear Usuario
```bash
curl -X POST http://localhost:3005/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","role":"USER"}' \
  -b cookies.txt
```

**Respuesta esperada:**
```json
{
  "id": "...",
  "email": "test@example.com",
  "role": "USER",
  "createdAt": "...",
  "updatedAt": "..."
}
```

---

## ⚡ Comandos de Prueba Rápida

### Test Completo en 3 Comandos
```bash
# 1. Login
curl -X POST http://localhost:3005/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123456"}' \
  -c /tmp/test.txt

# 2. Ver perfil
curl http://localhost:3005/api/auth/profile -b /tmp/test.txt

# 3. Listar usuarios
curl http://localhost:3005/api/users -b /tmp/test.txt
```

---

## 🐛 Solución de Problemas

### Error: "Cannot GET /api/auth/login"
**Causa:** Estás usando GET en lugar de POST  
**Solución:** Usa `-X POST` en curl o cambia el método en Postman

### Error: "Cannot GET /api/auth/register"
**Causa:** Estás usando GET en lugar de POST  
**Solución:** Usa `-X POST` y envía el body JSON

### Error: 401 Unauthorized
**Causa:** No estás enviando las cookies o el JWT expiró  
**Solución:** Haz login primero y usa `-b cookies.txt`

### Error: 403 Forbidden
**Causa:** Tu usuario no tiene el rol necesario (necesitas ADMIN)  
**Solución:** Usa el usuario admin@example.com

---

## 💡 Recordatorios Importantes

1. **POST vs GET:**
   - POST = Enviar datos (login, register, crear)
   - GET = Obtener datos (profile, listar)

2. **Cookies:**
   - Siempre usa `-c cookies.txt` al hacer login
   - Siempre usa `-b cookies.txt` en requests autenticados

3. **Content-Type:**
   - Siempre incluye `-H "Content-Type: application/json"` en POST requests

4. **Body JSON:**
   - Usa `-d '{"key":"value"}'` para enviar datos

---

**Servidor corriendo en:** http://localhost:3005/api
