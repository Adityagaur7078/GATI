# GATI — Ride Booking Platform

<p align="center">
  <img src="./frontend/src/assets/gatilogowhite.png" alt="GATI Logo" width="180" />
</p>

<p align="center">
  A full-stack real-time ride-booking platform with separate passenger and captain experiences.
</p>

<p align="center">
  <a href="https://gati-tawny-tau.vercel.app/">Live Demo</a>
  ·
  <a href="https://github.com/Adityagaur7078/GATI">GitHub Repository</a>
</p>

---

## About GATI

**GATI** is a full-stack ride-booking application inspired by modern ride-hailing platforms.

The platform provides two separate experiences:

- **User** — search locations, select a vehicle, estimate fares, request rides, track the captain, and complete rides.
- **Captain** — register with vehicle details, receive ride requests, accept rides, navigate to passengers, verify ride OTPs, track rides, and complete rides.

The application combines REST APIs, JWT authentication, real-time Socket.IO communication, geolocation services, routing, fare calculation, and interactive maps into a complete ride-booking workflow.

---

## Live Application

### Frontend

**https://gati-tawny-tau.vercel.app/**

The frontend is deployed on Vercel.

### Backend

The backend is deployed separately as a Node.js/Express service.

---

## Features

### User

- [x] User registration and login
- [x] JWT-based authentication
- [x] Protected user routes
- [x] Location search and suggestions
- [x] Pickup and destination selection
- [x] Vehicle selection
- [x] Fare estimation
- [x] Ride creation
- [x] Real-time captain updates
- [x] Live ride tracking
- [x] OTP-based ride confirmation
- [x] Ride completion
- [x] Logout

### Captain

- [x] Captain registration
- [x] Vehicle information during registration
- [x] Captain login
- [x] JWT-based authentication
- [x] Protected captain routes
- [x] Real-time ride requests
- [x] Accept or ignore ride requests
- [x] Pickup navigation
- [x] OTP verification
- [x] Live location sharing
- [x] Ride completion
- [x] Logout

### Maps & Location

- [x] Address geocoding
- [x] Location suggestions
- [x] Distance calculation
- [x] Estimated travel duration
- [x] Driving routes
- [x] Interactive maps
- [x] OpenStreetMap-based mapping
- [x] OSRM-based routing
- [x] Geoapify / Nominatim / Photon location services

The backend uses Geoapify when configured and falls back to Nominatim and Photon when necessary.

### Real-Time Communication

Socket.IO is used for real-time ride events and location updates between users and captains.

```text
User
  │
  │ Create Ride
  ▼
Backend
  │
  │ Socket.IO
  ▼
Captain
  │
  │ Accept Ride
  ▼
Backend
  │
  │ Socket.IO
  ▼
User
````

---

## Ride Flow

The complete ride lifecycle follows this flow:

```text
┌──────────────┐
│     User     │
└──────┬───────┘
       │
       │ Select pickup & destination
       ▼
┌──────────────────────┐
│ Location / Map APIs  │
└──────────┬───────────┘
           │
           │ Distance + Duration
           ▼
┌──────────────────────┐
│   Fare Calculation   │
└──────────┬───────────┘
           │
           │ Create Ride
           ▼
┌──────────────────────┐
│        Backend       │
└──────────┬───────────┘
           │
           │ Real-time request
           ▼
┌──────────────────────┐
│       Captain        │
└──────────┬───────────┘
           │
           │ Accept
           ▼
┌──────────────────────┐
│   Pickup Navigation  │
└──────────┬───────────┘
           │
           │ OTP Verification
           ▼
┌──────────────────────┐
│    Ride Ongoing      │
└──────────┬───────────┘
           │
           │ Live Location
           ▼
┌──────────────────────┐
│   Ride Completion    │
└──────────────────────┘
```

---

## Architecture

GATI follows a separated frontend/backend architecture.

```text
                    ┌─────────────────────┐
                    │       User          │
                    │   React Frontend    │
                    └──────────┬──────────┘
                               │
                               │ REST API
                               │ Socket.IO
                               ▼
                    ┌─────────────────────┐
                    │   Node.js + Express │
                    │       Backend       │
                    └──────┬──────┬───────┘
                           │      │
                 ┌─────────┘      └─────────┐
                 ▼                          ▼
        ┌─────────────────┐        ┌─────────────────┐
        │ MongoDB / Atlas │        │ Location APIs   │
        │     Database    │        │ Geoapify        │
        └─────────────────┘        │ Nominatim       │
                                   │ Photon / OSRM    │
                                   └─────────────────┘
```

---

## Technology Stack

### Frontend

| Technology        | Purpose                             |
| ----------------- | ----------------------------------- |
| React             | User interface                      |
| Vite              | Build tool and development server   |
| React Router DOM  | Client-side routing                 |
| Axios             | HTTP communication                  |
| React Context API | Authentication and state management |
| Socket.IO         | Real-time communication             |
| Leaflet           | Interactive maps                    |
| React Leaflet     | React integration for Leaflet       |
| OpenStreetMap     | Map data                            |
| OSRM              | Driving routes                      |
| Tailwind CSS      | Styling                             |
| JavaScript        | Application logic                   |

### Backend

| Technology        | Purpose                      |
| ----------------- | ---------------------------- |
| Node.js           | JavaScript runtime           |
| Express.js        | REST API framework           |
| MongoDB           | Database                     |
| Mongoose          | MongoDB ODM                  |
| JWT               | Authentication               |
| bcrypt            | Password hashing             |
| Socket.IO         | Real-time communication      |
| Express Validator | Request validation           |
| Axios             | External API communication   |
| Geoapify          | Geocoding/location search    |
| Nominatim         | Geocoding fallback           |
| Photon            | Location search fallback     |
| OSRM              | Routing and travel estimates |

---

## Authentication

GATI uses JWT-based authentication.

Authentication is implemented separately for users and captains.

```text
                 Authentication
                       │
             ┌─────────┴─────────┐
             │                   │
          User Auth          Captain Auth
             │                   │
      ┌──────┴──────┐     ┌──────┴──────┐
      │             │     │             │
   Register       Login Register       Login
      │             │     │             │
      └──────┬──────┘     └──────┬──────┘
             │                   │
             └─────────┬─────────┘
                       ▼
                  JWT Token
                       │
                       ▼
                Protected APIs
```

The backend supports JWT authentication through a token cookie or an `Authorization: Bearer <jwt-token>` header.

---

## Project Structure

```text
GATI/
│
├── backend/
│   ├── controllers/
│   ├── db/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── socket.js
│   ├── app.js
│   ├── server.js
│   ├── package.json
│   └── README.md
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── README.md
│
├── .gitignore
└── README.md
```

---

## API Overview

The backend exposes separate API groups for users, captains, maps, and rides.

| Resource | Base Route  | Purpose                                   |
| -------- | ----------- | ----------------------------------------- |
| Users    | `/users`    | User authentication and profile           |
| Captains | `/captains` | Captain authentication and profile        |
| Maps     | `/maps`     | Geocoding, suggestions, distance and time |
| Rides    | `/rides`    | Ride creation and ride lifecycle          |

### User APIs

```http
POST /users/register
POST /users/login
GET  /users/profile
POST /users/logout
```

### Captain APIs

```http
POST /captains/register
POST /captains/login
GET  /captains/profile
GET  /captains/logout
```

### Map APIs

```http
GET /maps/get-coordinates
GET /maps/get-distance-time
GET /maps/get-suggestions
```

### Ride APIs

```http
POST /rides/create
GET  /rides/get-fare
POST /rides/accept
POST /rides/confirm
POST /rides/complete
```

For complete request bodies, response formats, validation rules, authentication requirements, and API details, see:

**[Backend README](./backend/README.md)**

---

## Frontend Documentation

For detailed frontend documentation, see:

**[Frontend README](./frontend/README.md)**

The frontend documentation covers:

* Frontend features
* Authentication flows
* User routes
* Captain routes
* Project structure
* Environment variables
* Development setup
* Available scripts
* Ride lifecycle

---

## Getting Started

### Prerequisites

Make sure you have:

* Node.js
* npm
* Git
* MongoDB or MongoDB Atlas

---

## Clone the Repository

```bash
git clone https://github.com/Adityagaur7078/GATI.git

cd GATI
```

---

## Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside `backend`:

```env
PORT=4000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

GEOAPIFY_API_KEY=your_geoapify_api_key
```

Start the backend:

```bash
npm start
```

The backend runs locally on:

```text
http://localhost:4000
```

---

## Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
```

Create:

```text
frontend/.env
```

Add:

```env
VITE_BASE_URL=http://localhost:4000
```

Start the frontend:

```bash
npm run dev
```

The Vite development server is typically available at:

```text
http://localhost:5173
```

---

## Production Build

From the `frontend` directory:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

---

## Environment Variables

### Backend

```env
PORT=
MONGO_URI=
JWT_SECRET=
GEOAPIFY_API_KEY=
```

### Frontend

```env
VITE_BASE_URL=
```

Do not commit private credentials, database connection strings, JWT secrets, or API keys to the repository.

---

## Deployment

GATI uses a separated deployment architecture:

```text
GitHub
   │
   ├───────────────┐
   ▼               ▼
Vercel           Render
   │               │
   ▼               ▼
Frontend         Backend
   │               │
   └───────┬───────┘
           │
           ▼
      MongoDB Atlas
```

### Frontend

Deployed on Vercel:

**[https://gati-tawny-tau.vercel.app/](https://gati-tawny-tau.vercel.app/)**

### Backend

Deployed separately as a Node.js/Express service.

### Database

MongoDB Atlas is used for persistent application data.

---

## Current Status

### Completed

* [x] React + Vite frontend
* [x] User authentication
* [x] Captain authentication
* [x] Protected routes
* [x] JWT authentication
* [x] User/captain state management
* [x] Location search
* [x] Geocoding
* [x] Distance and duration calculation
* [x] Fare calculation
* [x] Vehicle selection
* [x] Ride creation
* [x] Captain ride requests
* [x] Ride acceptance
* [x] OTP-based ride confirmation
* [x] Live location tracking
* [x] Interactive maps
* [x] Driving routes
* [x] Ride completion
* [x] Frontend deployment
* [x] Backend deployment

### Planned

* [ ] Payment gateway integration
* [ ] Automated frontend tests
* [ ] Automated backend tests
* [ ] Improved authentication persistence UX
* [ ] Production-grade location provider strategy
* [ ] Further performance optimization

---

## Application Flow

### User

```text
Welcome
   ↓
Signup / Login
   ↓
Home
   ↓
Location Search
   ↓
Vehicle Selection
   ↓
Fare
   ↓
Ride Request
   ↓
Captain Assigned
   ↓
Live Ride
   ↓
Ride Completed
```

### Captain

```text
Signup / Login
       ↓
Captain Home
       ↓
Incoming Ride Request
       ↓
Accept Ride
       ↓
Navigate to Pickup
       ↓
OTP Verification
       ↓
Active Ride
       ↓
Complete Ride
```

---

## Engineering Concepts Demonstrated

GATI was built to practice real-world full-stack engineering concepts, including:

* REST API design
* JWT authentication
* Password hashing
* Protected routes
* Request validation
* MongoDB data modeling
* Controller/service separation
* Real-time event-driven communication
* Socket.IO
* WebSocket-based location updates
* Geocoding
* Routing
* Fare calculation
* Client-side state management
* Environment-based configuration
* External API integration
* Frontend/backend separation
* Production builds
* Cloud deployment

---

## Learning Goals

This project focuses on understanding how different parts of a modern full-stack application work together:

```text
Frontend
   +
Backend
   +
Database
   +
Authentication
   +
Real-Time Systems
   +
Maps
   +
External APIs
   +
Deployment
```

The goal is not only to build individual features, but to understand how those features interact as one production-style application.

---

## Author

**Aditya Gaur**

GitHub:
[https://github.com/Adityagaur7078](https://github.com/Adityagaur7078)

LinkedIn:
[https://www.linkedin.com/in/aditya-gaur-b484412bb/](https://www.linkedin.com/in/aditya-gaur-b484412bb/)

---

## License

This project is intended for educational and development purposes.
