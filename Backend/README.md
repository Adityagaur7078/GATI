# Backend API

## Base URL

The backend is served from the configured host and port. By default, this app runs on:

```http
http://localhost:3000
```

Authentication uses a JWT token stored in a cookie named `token` or sent in the `Authorization` header:

```http
Authorization: Bearer <jwt-token>
```

---

## User Routes

### Register User

Creates a new user account and returns a JWT token.

#### Endpoint

```http
POST /users/register
```

#### Request Body

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

#### Required Fields

- `fullName.firstName`: required, minimum 3 characters
- `fullName.lastName`: optional, if provided must be at least 3 characters
- `email`: required, valid email format
- `password`: required, minimum 8 characters

#### Success Response

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

#### Error Response

**Status:** `400 Bad Request`

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

### Login User

Authenticates an existing user and returns a JWT token.

#### Endpoint

```http
POST /users/login
```

#### Request Body

```json
{
  "email": "aditya@example.com",
  "password": "password123"
}
```

#### Required Fields

- `email`: required, valid email format
- `password`: required, minimum 8 characters

#### Success Response

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

#### Error Response

**Status:** `401 Unauthorized`

```json
{
  "message": "Invalid email or password"
}
```

### Get User Profile

Returns the authenticated user's profile.

#### Endpoint

```http
GET /users/profile
```

#### Authentication

Requires a valid JWT token.

#### Success Response

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

#### Error Response

**Status:** `401 Unauthorized`

```json
{
  "message": "Unauthorized"
}
```

### Logout User

Logs the current user out and blacklists the active token.

#### Endpoint

```http
POST /users/logout
```

#### Authentication

Requires a valid JWT token.

#### Success Response

**Status:** `200 OK`

```json
{
  "message": "Logged Out"
}
```

#### Error Response

**Status:** `401 Unauthorized`

```json
{
  "message": "Unauthorized"
}
```

---

## Captain Routes

### Register Captain

Creates a new captain account and returns a JWT token.

#### Endpoint

```http
POST /captains/register
```

#### Request Body

```json
{
  "fullName": {
    "firstName": "Daniel",
    "lastName": "Michel"
  },
  "email": "daniel@example.com",
  "password": "password123",
  "vehicle": {
    "color": "black",
    "plate": "UK20GD2435",
    "capacity": 4,
    "vehicleType": "car"
  }
}
```

#### Required Fields

- `fullName.firstName`: required, minimum 3 characters
- `fullName.lastName`: optional, if provided must be at least 3 characters
- `email`: required, valid email format
- `password`: required, minimum 8 characters
- `vehicle.color`: required, minimum 3 characters
- `vehicle.plate`: required, minimum 3 characters
- `vehicle.capacity`: required, integer greater than or equal to 1
- `vehicle.vehicleType`: required, one of `car`, `motorcycle`, `auto`

#### Success Response

**Status:** `201 Created`

```json
{
  "token": "<jwt-token>",
  "captain": {
    "_id": "<captain-id>",
    "fullName": {
      "firstName": "Daniel",
      "lastName": "Michel"
    },
    "email": "daniel@example.com",
    "vehicle": {
      "color": "black",
      "plate": "UK20GD2435",
      "capacity": 4,
      "vehicleType": "car"
    }
  }
}
```

#### Error Response

**Status:** `400 Bad Request`

```json
{
  "message": "Captain already exist"
}
```

### Login Captain

Authenticates an existing captain and returns a JWT token.

#### Endpoint

```http
POST /captains/login
```

#### Request Body

```json
{
  "email": "daniel@example.com",
  "password": "password123"
}
```

#### Required Fields

- `email`: required, valid email format
- `password`: required, minimum 8 characters

#### Success Response

**Status:** `200 OK`

```json
{
  "token": "<jwt-token>",
  "captain": {
    "_id": "<captain-id>",
    "fullName": {
      "firstName": "Daniel",
      "lastName": "Michel"
    },
    "email": "daniel@example.com",
    "vehicle": {
      "color": "black",
      "plate": "UK20GD2435",
      "capacity": 4,
      "vehicleType": "car"
    }
  }
}
```

#### Error Response

**Status:** `401 Unauthorized`

```json
{
  "message": "Invalid email or password"
}
```

### Get Captain Profile

Returns the authenticated captain profile.

#### Endpoint

```http
GET /captains/profile
```

#### Authentication

Requires a valid JWT token.

#### Success Response

**Status:** `200 OK`

```json
{
  "_id": "<captain-id>",
  "fullName": {
    "firstName": "Daniel",
    "lastName": "Michel"
  },
  "email": "daniel@example.com",
  "vehicle": {
    "color": "black",
    "plate": "UK20GD2435",
    "capacity": 4,
    "vehicleType": "car"
  }
}
```

#### Error Response

**Status:** `401 Unauthorized`

```json
{
  "message": "Unauthorized"
}
```

### Logout Captain

Logs the current captain out and blacklists the active token.

#### Endpoint

```http
GET /captains/logout
```

#### Authentication

Requires a valid JWT token.

#### Success Response

**Status:** `200 OK`

```json
{
  "message": "Logout succesfully"
}
```

#### Error Response

**Status:** `401 Unauthorized`

```json
{
  "message": "Unauthorized"
}
```

---

## Map Routes

All map routes require an authenticated user.

### Get Coordinates

Converts an address into coordinates.

#### Endpoint

```http
GET /maps/get-coordinates?address=<address>
```

#### Query Parameters

- `address`: required, minimum 3 characters

#### Success Response

**Status:** `200 OK`

```json
{
  "lat": 28.6139,
  "lng": 77.209
}
```

#### Error Response

**Status:** `404 Not Found`

```json
{
  "message": "Coordinates not found"
}
```

### Get Distance and Time

Gets trip distance and estimated time between two places.

#### Endpoint

```http
GET /maps/get-distance-time?origin=<origin>&destination=<destination>
```

#### Query Parameters

- `origin`: required, minimum 3 characters
- `destination`: required, minimum 3 characters

#### Success Response

**Status:** `200 OK`

```json
{
  "distance": "12.5 km",
  "duration": "25 mins"
}
```

#### Error Response

**Status:** `404 Not Found`

```json
{
  "message": "Unable to calculate distance and time"
}
```

### Get Suggestions

Returns location suggestions for typed input.

#### Endpoint

```http
GET /maps/get-suggestions?input=<text>
```

#### Query Parameters

- `input`: required, minimum 3 characters

#### Success Response

**Status:** `200 OK`

```json
{
  "suggestions": [
    "New Delhi",
    "Noida",
    "NCR"
  ]
}
```

#### Error Response

**Status:** `500 Internal Server Error`

```json
{
  "message": "Unable to fetch location suggestions"
}
```

---

## Ride Routes

### Create Ride

Creates a new ride request for an authenticated user.

#### Endpoint

```http
POST /rides/create
```

#### Authentication

Requires a valid authenticated user token.

#### Request Body

```json
{
  "pickup": "Connaught Place",
  "destination": "India Gate",
  "vehicleType": "car"
}
```

#### Required Fields

- `pickup`: required, minimum 3 characters
- `destination`: required, minimum 3 characters
- `vehicleType`: required, one of `auto`, `car`, `moto`

#### Success Response

**Status:** `201 Created`

```json
{
  "_id": "<ride-id>",
  "user": "<user-id>",
  "pickup": "Connaught Place",
  "destination": "India Gate",
  "vehicleType": "car"
}
```

#### Error Response

**Status:** `400 Bad Request`

```json
{
  "errors": [
    {
      "type": "field",
      "msg": "Invalid vehicle type",
      "path": "vehicleType",
      "location": "body"
    }
  ]
}
```

---

## Common Status Codes

- `200 OK`: successful request
- `201 Created`: resource created successfully
- `400 Bad Request`: validation failed or invalid payload
- `401 Unauthorized`: missing or invalid token
- `404 Not Found`: resource or map lookup not found
- `500 Internal Server Error`: server-side failure
