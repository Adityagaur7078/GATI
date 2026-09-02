Replace `README.md` with:

````markdown
# GATI — Ride Booking Frontend

GATI is a React-based ride-booking frontend built with Vite.

The application provides separate interfaces for passengers and captains, including authentication screens, client-side navigation, responsive UI, and user state management.

> **Project Status:** Frontend foundation completed. Backend API integration and persistent authentication are planned for the next phase.

---

## Features

- User login and signup
- Captain login and signup
- GATI landing page
- Separate user and captain flows
- Client-side routing with React Router
- User state management with React Context
- Responsive UI
- GATI branded assets
- HTML form validation

---

## Tech Stack

| Technology | Purpose |
|---|---|
| React | UI development |
| Vite | Build tool and development server |
| React Router DOM | Client-side routing |
| React Context API | User state management |
| Tailwind CSS | Utility-first styling |
| JavaScript | Application logic |

---

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
│   │   └── UserContext.jsx
│   ├── pages/
│   │   ├── CaptainLogin.jsx
│   │   ├── CaptainSignup.jsx
│   │   ├── Home.jsx
│   │   ├── UserLogin.jsx
│   │   └── UserSignup.jsx
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
└── vite.config.js
```

---

## Application Routes

| Route | Description |
|---|---|
| `/` | GATI landing page |
| `/login` | User login |
| `/signup` | User registration |
| `/captain-login` | Captain login |
| `/captain-signup` | Captain registration |

---

## Prerequisites

Make sure the following are installed:

- Node.js
- npm

Verify your installation:

```bash
node --version
npm --version
```

---

## Installation

Navigate to the frontend directory:

```bash
cd frontend
```

Install the project dependencies:

```bash
npm install
```

---

## Run the Development Server

Start the Vite development server:

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:5173
```

---

## Available Scripts

### Development

```bash
npm run dev
```

Starts the Vite development server.

### Production Build

```bash
npm run build
```

Creates an optimized production build.

### Preview

```bash
npm run preview
```

Serves the production build locally for testing.

### Lint

```bash
npm run lint
```

Runs lint checks.

---

## Authentication Flow

GATI provides separate authentication interfaces for users and captains.

### User Flow

```text
Landing Page
     ↓
User Login / Signup
     ↓
User Application
```

### Captain Flow

```text
Landing Page
     ↓
Captain Login / Signup
     ↓
Captain Application
```

The current login and signup forms collect user input and store submitted data in local component state.

Backend API integration, JWT authentication, persistent sessions, and protected routes will be implemented in a later phase.

---

## Development Roadmap

### Completed

- GATI landing page
- User signup interface
- User login interface
- Captain signup interface
- Captain login interface
- Client-side routing
- User Context setup
- Responsive styling
- GATI branding and assets

### Planned

- Connect authentication to backend APIs
- Implement persistent authentication
- Add protected routes
- Add user and captain profiles
- Add ride-booking interface
- Add ride request and acceptance flows
- Add live ride tracking
- Improve loading and error states
- Add frontend testing

---

## License

This project is intended for educational and development purposes.
````