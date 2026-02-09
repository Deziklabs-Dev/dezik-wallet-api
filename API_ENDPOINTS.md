# API Endpoints

## Authentication Endpoints

### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "admin123456"
}
```

**Response:**
- Sets `access_token` cookie (HTTP-only, secure)
- Returns user information

### Logout
```bash
POST /api/auth/logout
```

**Response:**
- Clears `access_token` cookie

### Get Profile
```bash
GET /api/auth/profile
Cookie: access_token=<jwt_token>
```

**Response:**
- Returns current user information

### Register User (Admin Only)
```bash
POST /api/auth/register
Cookie: access_token=<admin_jwt_token>
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "role": "USER"
}
```

## User Management Endpoints (Admin Only)

### List All Users
```bash
GET /api/users
Cookie: access_token=<admin_jwt_token>
```

### Get User by ID
```bash
GET /api/users/:id
Cookie: access_token=<admin_jwt_token>
```

### Create User
```bash
POST /api/users
Cookie: access_token=<admin_jwt_token>
Content-Type: application/json

{
  "email": "newuser@example.com",
  "password": "password123",
  "role": "USER"
}
```

### Update User
```bash
PATCH /api/users/:id
Cookie: access_token=<admin_jwt_token>
Content-Type: application/json

{
  "email": "updated@example.com",
  "password": "newpassword123",
  "role": "ADMIN"
}
```

### Delete User
```bash
DELETE /api/users/:id
Cookie: access_token=<admin_jwt_token>
```

## Default Admin Credentials

After running the seed script:
- **Email:** admin@example.com
- **Password:** admin123456

⚠️ **IMPORTANT:** Change these credentials in production!
