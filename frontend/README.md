# GATI — Ride Booking Frontend

GATI is a React frontend built with Vite. It currently provides separate authentication flows and protected routes for users and captains.

## Features

### Completed

- [x] React + Vite frontend setup
- [x] GATI welcome page
- [x] Client-side routing with React Router
- [x] Responsive authentication interfaces
- [x] HTML form validation
- [x] Environment-based backend URL configuration

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

### Planned

- [ ] Ride booking functionality
- [ ] User and captain dashboards
- [ ] Ride requests and acceptance
- [ ] Maps and live tracking
- [ ] Payments
- [ ] Improved loading and error handling

## Tech Stack

| Technology | Purpose |
|---|---|
| React | User interface |
| Vite | Development server and build tool |
| React Router DOM | Client-side routing |
| Axios | Backend API communication |
| React Context API | User and captain state management |
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
VITE_BASE_URL=<backend-base-url>
```

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

### Currently in Progress

- Expanding user and captain home pages
- Improving authentication error and loading states
- Refining logout and session handling

### Future Work

- Ride booking
- Ride requests and acceptance
- Maps and live tracking
- Payments
- User and captain dashboards
- Frontend testing

## License

This project is intended for educational and development purposes.