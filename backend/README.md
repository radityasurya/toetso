# toet Backend API

A NestJS backend with JWT authentication, protected admin endpoints, role-based access control (RBAC), password hashing, and mock data for users, categories, and questions.

## Base URL

```
http://localhost:3000
```

---

## Authentication & Users

#### POST `/auth/login`
Authenticate and get JWT.

**Body example:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

#### POST `/auth/signup`
Register a new user (default `user` role).

**Body example:**
```json
{
  "username": "newuser",
  "email": "test@email.com",
  "password": "password123"
}
```

#### GET `/auth/me`  
Get information about current user (requires Authorization header).

---

## Role and Admin-Only

#### GET `/users/admin-only`  
Returns success only for logged-in users with `admin` role.

**Headers:**
```
Authorization: Bearer <your_token>
```

---

## Users (CRUD)

- `GET   /users`           — List users or by `?username=`
- `GET   /users/:id`       — Get user by ID
- `POST  /users`           — Create user
- `PUT   /users/:id`       — Update user
- `DELETE /users/:id`      — Delete user

---

## Questions (CRUD, must be logged in for POST/PUT/DELETE)

- `GET   /questions`        — List all questions
- `GET   /questions/:id`    — Get question by ID
- `POST  /questions`        — Create (add `Authorization: Bearer <token>`)
- `PUT   /questions/:id`    — Update (add `Authorization: Bearer <token>`)
- `DELETE /questions/:id`   — Delete (add `Authorization: Bearer <token>`)

On create/update, `createdBy` and `updatedBy` are auto-set from your auth token.

---

## Example Postman/HTTP Requests

### 1. Login (get token)

**Request:**
```
POST /auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "access_token": "JWT_TOKEN_STRING",
  "user": { "id": "...", "username": "admin", ... }
}
```

### 2. Create Question (must be logged in)

```
POST /questions
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "question": "What is 2+2?",
  "options": ["3", "4", "5", "6"],
  "correctAnswer": 1,
  "category": "Math"
}
```

### 3. Test Admin-Only Endpoint

```
GET /users/admin-only
Authorization: Bearer <admin_access_token>
```

If not admin, you get `403 Forbidden`.

---

## Environment setup

- Set up your `.env` as:
  ```
  JWT_SECRET=your-secret
  JWT_EXPIRES_IN=1h
  NODE_ENV=development
  PORT=3000
  ```

- Install dependencies:
  ```
  pnpm install
  # or
  npm install
  ```

- Start the API:
  ```
  npm run start:dev
  # or
  pnpm run start:dev
  ```

---

For any questions, see the code or ask the maintainer!
