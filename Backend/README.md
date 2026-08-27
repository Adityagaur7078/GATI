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
