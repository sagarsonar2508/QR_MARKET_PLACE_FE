# API Documentation

## Overview

The frontend connects to a Node.js/Express backend for authentication and data management.

## Base URL

Development: `http://localhost:3002`
Production: `https://api.qrmarket.com` (configure in `.env.local`)

## Authentication

### Request Headers

All authenticated requests must include:

```
Authorization: Bearer {token}
Content-Type: application/json
```

### Token Management

- Tokens are stored in `httpOnly` cookies
- Token expiry: 3 hours
- Use `useAuth()` hook to access token and authentication state

## Endpoints

### Authentication

#### POST /user/login

Login with email and password.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "Password123",
  "platform": "WEB"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "email": "user@example.com",
    "role": "cafe_owner",
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": 10800
  },
  "message": "Login successful"
}
```

**Error (401):**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

#### POST /user/signup/email

Register a new user with email.

**Request:**
```json
{
  "email": "newuser@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "platform": "WEB"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "email": "newuser@example.com",
    "role": null,
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": 10800
  },
  "message": "Signup successful"
}
```

**Error (409):**
```json
{
  "success": false,
  "message": "User with given email already exists."
}
```

#### POST /user/verify-email

Verify email with token.

**Request:**
```json
{
  "token": "email-verification-token",
  "email": "user@example.com"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Email verified successfully"
  },
  "message": "Email verified successfully"
}
```

#### POST /user/set-password

Set password after email verification.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "NewPassword123",
  "confirmPassword": "NewPassword123",
  "platform": "WEB"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Password set successfully"
  },
  "message": "Password set successfully"
}
```

#### POST /user/signup/google

Sign up with Google OAuth token.

**Request:**
```json
{
  "googleToken": "google-oauth-token",
  "firstName": "John",
  "lastName": "Doe",
  "platform": "WEB"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "email": "user@gmail.com",
    "role": null,
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": 10800
  },
  "message": "Google signup successful"
}
```

## Error Handling

All errors follow this format:

```json
{
  "success": false,
  "message": "Error message"
}
```

### Common Error Messages

- `Invalid email or password` - Wrong login credentials
- `User with given email already exists.` - Email already registered
- `User details not found.` - User account not found
- `Incorrect password` - Wrong password
- `User is not associated with any brand.` - User needs to set up their cafe

## Implementation Guide

### Using the API in Components

```typescript
import apiRequest from "@/lib/api";
import { LoginUserRequestData, LoginResponse, ApiResponse } from "@/types";

// Login
const loginData: LoginUserRequestData = {
  email: "user@example.com",
  password: "password",
  platform: "WEB"
};

const response = await apiRequest<ApiResponse<LoginResponse>>("/user/login", {
  method: "POST",
  body: JSON.stringify(loginData),
});

const { token, email, role } = response.data;
```

### Using Auth Hook

```typescript
import { useAuth } from "@/context/AuthContext";

export default function MyComponent() {
  const { user, token, login, signup, logout } = useAuth();
  
  // Use authentication functions
  await login("user@example.com", "password");
  await signup("user@example.com", "John", "Doe");
  logout();
}
```

## Rate Limiting

Currently no rate limiting is implemented. This should be added for production.

## CORS Configuration

Frontend allowed origins:
- `http://localhost:3000` (development)
- `https://qrmarket.com` (production)

## Security Considerations

1. **HTTPS Only**: Use HTTPS in production
2. **HTTPOnly Cookies**: Tokens stored in secure, httpOnly cookies
3. **CSRF Protection**: Implement CSRF tokens if needed
4. **Input Validation**: Always validate user input on client and server
5. **Token Expiry**: Implement token refresh mechanism (future)

## Future Endpoints

These endpoints are planned for future versions:

- `GET /user/profile` - Get current user profile
- `PUT /user/profile` - Update user profile
- `POST /user/change-password` - Change password
- `POST /user/reset-password` - Request password reset
- `POST /cafe` - Create cafe
- `GET /cafe` - Get user's cafes
- `POST /qrcode` - Create QR code
- `GET /qrcode` - Get user's QR codes
- `POST /orders` - Create order
- `GET /orders` - Get user's orders
