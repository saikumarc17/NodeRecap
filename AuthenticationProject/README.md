# AuthenticationProject

Simple Node.js + Express authentication example using Drizzle ORM and PostgreSQL.

## Overview
- Signup stores user with per-user salt + HMAC-SHA256 hashed password.
- Login verifies password and creates a session record.
- DB schema: `users` and `user_Session` (see `db/schema.js`).

## Endpoints

1. Health
- GET /
- Response: 200 OK, body: text

2. Signup
- POST /users/signup
- Headers: `Content-Type: application/json`
- Body (JSON):
  {
    "name": "Alice",
    "email": "alice@example.com",
    "password": "plaintext-password"
  }
- Success: 201 Created
  {
    "status": "success",
    "data": { "userId": "<uuid>" }
  }
- Errors:
  - 400 if email already exists
  - 4xx/5xx for validation/DB errors

Example curl:
```bash
curl -X POST http://localhost:8000/users/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","email":"alice@example.com","password":"secret"}'