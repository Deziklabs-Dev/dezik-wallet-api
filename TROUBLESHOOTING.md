# 🔧 Solución a Errores Comunes

## ❌ Error: "The datasource property `url` is no longer supported"

### ¿Por qué aparece este error?

Este error aparece en tu IDE porque:
- Tu IDE tiene instalada la extensión de Prisma que detecta Prisma 7
- **PERO** tu proyecto está usando Prisma 5.22.0 (versión correcta)

### ✅ Solución: IGNORAR el error

**Este error es SOLO una advertencia del IDE y NO afecta tu código.**

**Verificación:**
```bash
npx prisma --version
# Debe mostrar: prisma: 5.22.0
```

En `package.json` tienes:
```json
"@prisma/client": "5.22.0"
```

**Conclusión:** El schema está correcto para Prisma 5. La advertencia del IDE es incorrecta.

---

## ❌ Error: "EADDRINUSE: address already in use :::3005"

### ¿Por qué aparece?

Ya tienes un servidor corriendo en el puerto 3005.

### ✅ Solución 1: Detener el proceso anterior

```bash
# Encontrar y matar el proceso en el puerto 3005
lsof -ti :3005 | xargs kill -9

# Luego reiniciar
npm run start:dev
```

### ✅ Solución 2: Usar otro puerto

Edita `.env`:
```env
PORT=3006
```

Luego reinicia el servidor.

---

## 🎯 Pasos Recomendados

### 1. Verificar que no hay procesos corriendo
```bash
lsof -i :3005
```

Si muestra algo, mátalo:
```bash
lsof -ti :3005 | xargs kill -9
```

### 2. Iniciar el servidor
```bash
npm run start:dev
```

### 3. Verificar que funciona
```bash
curl http://localhost:3005/api/auth/profile
```

---

## 📝 Notas Importantes

### Sobre Prisma 5 vs Prisma 7

- **Usamos Prisma 5.22.0** (estable y funcional)
- **Prisma 7** tiene cambios breaking
- El schema con `url = env("DATABASE_URL")` es **CORRECTO** para Prisma 5
- La advertencia del IDE es para Prisma 7, **ignórala**

### Sobre los Puertos

- Puerto configurado: **3005**
- Si cambias el puerto, actualiza también en:
  - `.env` → `PORT=XXXX`
  - Documentación y comandos curl

---

## ✅ Estado Actual del Sistema

- ✅ Prisma 5.22.0 instalado
- ✅ Schema correcto para Prisma 5
- ✅ Base de datos migrada
- ✅ Usuario admin creado
- ✅ Puerto configurado: 3005

**El sistema está funcionando correctamente. Solo necesitas detener procesos duplicados.**
