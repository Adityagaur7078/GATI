# GATI — Ride Booking Frontend

GATI is a React ride-booking frontend built with Vite. It provides separate authenticated user and captain experiences with live maps and Socket.IO ride updates.

## Features

### Completed

- [x] React + Vite frontend setup
- [x] GATI welcome page
- [x] Client-side routing with React Router
- [x] Responsive authentication interfaces
- [x] HTML form validation
- [x] Environment-based backend URL configuration
- [x] User ride creation and fare estimation
- [x] Captain ride requests and acceptance
- [x] OTP-based ride start confirmation
- [x] Live captain and user location tracking
- [x] OpenStreetMap maps with driving routes and map controls
- [x] Ride completion and user redirect to home

### Authentication

- [x] User signup and login pages
- [x] Captain signup and login pages
- [x] Axios communication with authentication APIs
- [x] Authentication tokens stored in `localStorage`
- [x] User authentication state with React Context
- [x] Captain authentication state with React Context
- [x] Separate user and captain authentication flows
- [ ] Persistent authentication state after page reload

### User Features

- [x] User profile verification
- [x] Protected user home route
- [x] User logout route and backend request

### Captain Features

- [x] Captain registration with vehicle details
- [x] Captain profile verification
- [x] Protected captain home route
- [x] Captain logout route and backend request
- [x] Incoming ride popup with accept and ignore actions
- [x] Pickup navigation and OTP confirmation flow
- [x] Ride completion flow

### Remaining Work

- [ ] Persistent authentication state after page reload
- [ ] Payment gateway integration
- [ ] Automated frontend and backend tests

## Tech Stack

| Technology | Purpose |
|---|---|
| React | User interface |
| Vite | Development server and build tool |
| React Router DOM | Client-side routing |
| Axios | Backend API communication |
| React Context API | User and captain state management |
| Socket.IO | Live ride events and location updates |
| Leaflet / React Leaflet | Interactive maps |
| OpenStreetMap / OSRM | Map tiles and driving routes |
| Tailwind CSS | Styling |
| JavaScript | Application logic |

## Project Structure

```text
frontend/
├── public/
├── src/
│   ├── assets/
│   │   ├── gatibackground.png
│   │   ├── gatilogoblack.png
│   │   ├── gatilogoblackcaptain.png
│   │   └── gatilogowhite.png
│   ├── context/
│   │   ├── CaptainContext.jsx
│   │   └── UserContext.jsx
│   ├── pages/
│   │   ├── CaptainHome.jsx
│   │   ├── CaptainLogin.jsx
│   │   ├── CaptainLogout.jsx
│   │   ├── CaptainProtectedWrapper.jsx
│   │   ├── CaptainSignup.jsx
│   │   ├── Home.jsx
│   │   ├── UserLogin.jsx
│   │   ├── UserLogout.jsx
│   │   ├── UserProtectWrapper.jsx
│   │   ├── UserSignup.jsx
│   │   └── WelcomePage.jsx
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
└── vite.config.js
```

## Application Routes

| Route | Access | Description |
|---|---|---|
| `/` | Public | Welcome page |
| `/login` | Public | User login |
| `/signup` | Public | User registration |
| `/captain-login` | Public | Captain login |
| `/captain-signup` | Public | Captain registration |
| `/home` | User protected | User home page |
| `/user/logout` | User protected | User logout |
| `/captain-home` | Captain protected | Captain home page |
| `/captain/logout` | Captain protected | Captain logout |
| `/captain/riding` | Captain protected | Active ride and completion flow |
| `/riding` | User protected | Active ride and live tracking |

## Authentication Flow

### User Authentication

```text
User
  ↓
User login or signup page
  ↓
Axios request
  ↓
Backend users API
  ↓
Authentication response
  ↓
UserContext state and localStorage token
  ↓
UserProtectWrapper
  ↓
Protected user route
```

User-protected routes verify the stored token through the backend user profile endpoint. Users without a valid token are redirected to `/login`.

### Captain Authentication

```text
Captain
  ↓
Captain login or signup page
  ↓
Axios request
  ↓
Backend captains API
  ↓
Authentication response
  ↓
CaptainContext state and localStorage token
  ↓
CaptainProtectedWrapper
  ↓
Protected captain route
```

Captain-protected routes verify the stored token through the backend captain profile endpoint. Captains without a valid token are redirected to `/captain-login`.

## Environment Variables

Create a `.env` file in the `frontend` directory:

```env
VITE_BASE_URL=http://localhost:3000
```

`VITE_BASE_URL` is used as the backend base URL for authentication, profile, and logout requests.

Do not commit secrets or private credentials to the repository.

## Setup

### Clone the Repository

```bash
git clone https://github.com/Adityagaur7078/GATI
cd GATI/frontend
```

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

Create `frontend/.env` and add:

```env
VITE_BASE_URL=http://localhost:4000
```

`VITE_BASE_URL` is used for authentication, rides, maps, and Socket.IO.

### Start the Development Server

```bash
npm run dev
```

The application is typically available at:

```text
http://localhost:5173
```

## Available Scripts

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

## Project Status

### Completed

- React and Vite project setup
- User authentication pages and API integration
- Captain authentication pages and API integration
- User and captain Context providers
- User and captain protected wrappers
- Public and protected route configuration
- Axios-based backend communication
- Environment-based backend configuration

### Implemented Ride Flow

- User selects locations and vehicle type.
- Backend calculates fare and creates a ride with a four-digit OTP.
- Nearby captains receive the ride request in real time.
- Captain accepts the ride and sees a driving route to the user.
- Captain enters the user's OTP to start the ride.
- Both screens receive live location updates.
- Captain completes the ride and the user returns to `/home`.

### Future Work

- Payment gateway integration
- Frontend testing

## License

This project is intended for educational and development purposes.