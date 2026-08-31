# Backend API

## Register User

Creates a new user account and returns an authentication token.

### Endpoint

```http
POST /users/register
```

The server must be running on the configured host and port. By default, the backend uses port `3000`.

### Request Headers

```http
Content-Type: application/json
```

### Request Body

```json
{
  "fullName": {
    "firstName": "Aditya",
    "lastName": "Gaur"
  },
  "email": "aditya@example.com",
  "password": "password123"
}
```

### Required Data

| Field | Required | Requirements |
| --- | --- | --- |
| `fullName.firstName` | Yes | At least 3 characters |
| `fullName.lastName` | No | If provided, at least 3 characters |
| `email` | Yes | Must be a valid email address |
| `password` | Yes | At least 8 characters |

The password is hashed before the user is stored in the database.

### Successful Response

**Status:** `201 Created`

```json
{
  "token": "<jwt-token>",
  "user": {
    "_id": "<user-id>",
    "fullName": {
      "firstName": "Aditya",
      "lastName": "Gaur"
    },
    "email": "aditya@example.com",
    "socketId": null
  }
}
```

A `JWT_SECRET` environment variable must be configured for token generation.

### Error Responses

#### Validation error

**Status:** `400 Bad Request`

Returned when one or more request fields fail validation.

```json
{
  "errors": [
    {
      "type": "field",
      "value": "bad-email",
      "msg": "Invalid Email",
      "path": "email",
      "location": "body"
    }
  ]
}
```

#### Unexpected server or database error

**Status:** `500 Internal Server Error`

May occur if user creation or token generation fails. Duplicate email registration is also expected to fail because email addresses must be unique.

## Login User

Authenticates an existing user and returns an authentication token.

### Endpoint

```http
POST /users/login
```

### Request Headers

```http
Content-Type: application/json
```

### Request Body

```json
{
  "email": "aditya@example.com",
  "password": "password123"
}
```

### Required Data

| Field | Required | Requirements |
| --- | --- | --- |
| `email` | Yes | Must be a valid email address |
| `password` | Yes | At least 8 characters |

### Successful Response

**Status:** `200 OK`

```json
{
  "token": "<jwt-token>",
  "user": {
    "_id": "<user-id>",
    "fullName": {
      "firstName": "Aditya",
      "lastName": "Gaur"
    },
    "email": "aditya@example.com",
    "socketId": null
  }
}
```

### Error Responses

#### Validation error

**Status:** `400 Bad Request`

Returned when the email is invalid or the password is shorter than 8 characters.

```json
{
  "errors": [
    {
      "type": "field",
      "msg": "Invalid Email",
      "path": "email",
      "location": "body"
    }
  ]
}
```

#### Invalid credentials

**Status:** `401 Unauthorized`

Returned when the email does not exist or the password is incorrect.

```json
{
  "message": "Invalid email or password"
}
```

#### Unexpected server or database error

**Status:** `500 Internal Server Error`

May occur if the database lookup or token generation fails.

## Get User Profile

Returns the currently authenticated user's profile.

### Endpoint

```http
GET /users/profile
```

### Authentication

This route requires a valid JWT token. The server accepts it from either a cookie named `token` or the `Authorization` header:

```http
Authorization: Bearer <jwt-token>
```

### Successful Response

**Status:** `200 OK`

```json
{
  "_id": "<user-id>",
  "fullName": {
    "firstName": "Aditya",
    "lastName": "Gaur"
  },
  "email": "aditya@example.com",
  "socketId": null
}
```

### Error Responses

#### Unauthorized

**Status:** `401 Unauthorized`

Returned when no token is provided, the token is invalid, or the token has been blacklisted.

```json
{
  "message": "Unauthorized"
}
```

## Logout User

Logs the current user out by clearing the cookie and blacklisting the active JWT token.

### Endpoint

```http
GET /users/logout
```

### Authentication

This route requires a valid JWT token in the same way as `/users/profile`.

### Successful Response

**Status:** `200 OK`

```json
{
  "message": "Logged Out"
}
```

### Error Responses

#### Unauthorized

**Status:** `401 Unauthorized`

Returned when the token is missing, invalid, or expired.

```json
{
  "message": "Unauthorized"
}
```

#### Unexpected server or database error

**Status:** `500 Internal Server Error`

May occur if the token blacklist write fails.
