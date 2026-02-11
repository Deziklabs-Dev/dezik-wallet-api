# Security Configuration Guide

## Environment Variables for Production

### Critical: Generate Strong Secrets

Before deploying to production, you MUST generate strong, random secrets for JWT and cookies.

#### Generate Secrets (Linux/Mac)

```bash
# Generate JWT Secret (32+ characters)
openssl rand -base64 32

# Generate Cookie Secret (32+ characters)
openssl rand -base64 32
```

#### Generate Secrets (Windows PowerShell)

```powershell
# Generate JWT Secret
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | % {[char]$_})

# Generate Cookie Secret
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | % {[char]$_})
```

### Production .env Configuration

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/digital_wallet?schema=public"

# JWT Configuration - REPLACE WITH GENERATED SECRETS
JWT_SECRET="<GENERATED_SECRET_HERE>"
JWT_EXPIRES_IN="7d"

# Cookie Configuration - REPLACE WITH GENERATED SECRETS
COOKIE_SECRET="<GENERATED_SECRET_HERE>"

# Application
PORT=3000
NODE_ENV="production"

# CORS - REPLACE WITH YOUR ACTUAL FRONTEND URL
FRONTEND_URL="https://yourdomain.com"
```

## Security Features Implemented

### 1. ✅ CORS Protection
- Configured to accept requests only from `FRONTEND_URL`
- Prevents unauthorized cross-origin access

### 2. ✅ Helmet Security Headers
- XSS protection
- Clickjacking prevention
- MIME type sniffing protection
- Content Security Policy (production only)

### 3. ✅ Rate Limiting
- **Global**: 100 requests per minute
- **Login**: 5 attempts per minute (brute force protection)
- **Register**: 3 attempts per minute (spam prevention)

### 4. ✅ Strong Password Policy
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character (@$!%*?&)

### 5. ✅ HTTP-Only Cookies
- JWT stored in HTTP-only cookies
- `secure: true` in production (HTTPS only)
- `sameSite: 'strict'` for CSRF protection

## Pre-Production Checklist

- [ ] Generate and set strong JWT_SECRET (32+ characters)
- [ ] Generate and set strong COOKIE_SECRET (32+ characters)
- [ ] Set FRONTEND_URL to actual production domain
- [ ] Set NODE_ENV to "production"
- [ ] Verify HTTPS is enabled
- [ ] Test rate limiting on login endpoint
- [ ] Test password validation with weak passwords
- [ ] Review security headers in browser DevTools

## Testing Security Features

### Test Rate Limiting

```bash
# Try to login more than 5 times in a minute
for i in {1..6}; do
  curl -X POST http://localhost:3000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"wrong"}' \
    -w "\nStatus: %{http_code}\n"
done
# Expected: First 5 should return 401, 6th should return 429 (Too Many Requests)
```

### Test Password Validation

```bash
# Weak password (should fail)
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"weak","role":"USER"}'
# Expected: 400 Bad Request with validation error

# Strong password (should succeed if authenticated as ADMIN)
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -H "Cookie: access_token=<YOUR_ADMIN_TOKEN>" \
  -d '{"email":"test@test.com","password":"Strong@Pass123","role":"USER"}'
# Expected: 201 Created
```

### Verify Security Headers

Open browser DevTools → Network tab → Check response headers for:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: SAMEORIGIN`
- `X-XSS-Protection: 0`
- `Strict-Transport-Security` (in production with HTTPS)

## Additional Recommendations

### Future Enhancements (Optional)

1. **Audit Logging**: Log all authentication events
2. **Refresh Tokens**: Implement token refresh mechanism
3. **Email Verification**: Verify user emails on registration
4. **2FA**: Add two-factor authentication
5. **IP Whitelisting**: Restrict admin access to specific IPs

### Monitoring

Consider implementing:
- Failed login attempt monitoring
- Unusual activity detection
- Security event alerts

## Support

For security concerns or questions, refer to:
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [NestJS Security](https://docs.nestjs.com/security/helmet)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
