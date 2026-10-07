# Testimonial & Social Proof Collector API Documentation

Base URL: `http://localhost:5000/api`

---

## 🔒 CORS Security Policy

- **Allowed Origin**: Restricted strictly to origins specified in `CLIENT_URL` (default: `http://localhost:5173`).
- **Credentials**: Enabled (`credentials: true`), allowing `httpOnly` authentication cookies (`accessToken` and `refreshToken`).
- **Arbitrary Origins**: Blocked (`callback(null, false)` for unauthorized browser origins).
- **Preflight**: OPTIONS requests handled with status 204 and explicit CORS response headers.
- **Server Requests**: Server-to-server and health check requests with no `Origin` header are permitted.

---

## 1. Authentication Architecture (`/api/auth`)

Security Architecture:
- **Access Token**: Short-lived JWT (15-minute lifetime) delivered via `httpOnly` cookie `accessToken`.
- **Refresh Token**: Long-lived JWT (7-day lifetime) delivered via `httpOnly` cookie `refreshToken` with database rotation.
- **Frontend Storage**: The React client does NOT store or handle raw JWT tokens in `localStorage`, `sessionStorage`, or JavaScript variables.
- **Request Transport**: All requests use `withCredentials: true`, allowing browsers to automatically submit `httpOnly` cookies.

### 1.1 Sign Up
- **Method**: `POST`
- **Path**: `/api/auth/signup`
- **Auth Required**: No
- **Request Body**:
```json
{
  "name": "Sarah Connor",
  "email": "owner@example.com",
  "password": "Password123!"
}
```

### 1.2 Verify Email Simulation
- **Method**: `POST`
- **Path**: `/api/auth/verify-email`
- **Auth Required**: No

### 1.3 Login
- **Method**: `POST`
- **Path**: `/api/auth/login`
- **Auth Required**: No
- **Request Body**:
```json
{
  "email": "owner@example.com",
  "password": "Password123!"
}
```
- **Response (200 OK)**:
Sets two `httpOnly` cookies: `accessToken` (15-minute maxAge) and `refreshToken` (7-day maxAge). Neither token is returned in the JSON response body.

### 1.4 Refresh Token (Rotation)
- **Method**: `POST`
- **Path**: `/api/auth/refresh`
- **Auth Required**: Automatically sends `refreshToken` httpOnly cookie.

### 1.5 Logout
- **Method**: `POST`
- **Path**: `/api/auth/logout`
- **Auth Required**: Yes

### 1.6 Current User (`/me`)
- **Method**: `GET`
- **Path**: `/api/auth/me`
- **Auth Required**: Automatically sends `accessToken` httpOnly cookie.

---

## 2. Space Management Endpoints (`/api/spaces`)

- `POST /api/spaces` (Create space)
- `GET /api/spaces` (List owner spaces)
- `GET /api/spaces/check-slug` (Check slug availability)
- `GET /api/spaces/:id` (Get space details)
- `PUT /api/spaces/:id` (Update space)
- `DELETE /api/spaces/:id` (Delete space)

---

## 3. Public Customer Endpoints (`/api/public`)

- `GET /api/public/spaces/:spaceSlug` (Public collection form details)
- `POST /api/public/spaces/:spaceSlug/testimonials` (Submit public testimonial, default status `pending`)
- `GET /api/public/spaces/:spaceSlug/approved` (Public approved reviews for Wall of Love / Embeds)

---

## 4. Moderation Dashboard Endpoints (`/api/testimonials`)

- `GET /api/testimonials/space/:spaceId?status=all&rating=5&search=keyword&page=1&limit=10`
- `PATCH /api/testimonials/:id/approve`
- `PATCH /api/testimonials/:id/reject`
- `PATCH /api/testimonials/:id/archive`
- `PATCH /api/testimonials/:id/feature`
- `PATCH /api/testimonials/:id/like`
- `DELETE /api/testimonials/:id`

---

## 5. Rating Analytics Endpoints (`/api/analytics`)

- `GET /api/analytics/overview`
- `GET /api/analytics/space/:spaceId`
