# insurancereportfinder — Architecture

## Purpose

React 18 single-page application. Provides login, dashboard, and detail views for incidents, sentiment analysis, and rival ad tracking.

## Directory Structure

```
insurancereportfinder/
├── public/
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── store/
│   │   ├── index.js         # Redux store config
│   │   └── slices/
│   │       └── authSlice.js # Login state, token, user role
│   ├── api/
│   │   ├── baseApi.js       # RTK Query base with JWT headers
│   │   ├── authApi.js
│   │   ├── incidentsApi.js
│   │   ├── sentimentsApi.js
│   │   └── rivalAdsApi.js
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Incidents.jsx
│   │   ├── Sentiments.jsx
│   │   ├── RivalAds.jsx
│   │   └── Admin.jsx
│   ├── components/
│   │   ├── ProtectedRoute.jsx
│   │   ├── Layout.jsx
│   │   ├── Navbar.jsx
│   │   └── charts/
│   │       ├── SentimentChart.jsx
│   │       └── IncidentTimeline.jsx
│   └── styles/
│       └── global.css
├── index.html
├── vite.config.js
├── package.json
├── Dockerfile
└── ARCHITECTURE.md
```

## State Management

- **Redux Toolkit** — global state (auth user, role, token)
- **RTK Query** — all API calls with 30s auto-polling on dashboard
- **React Router v6** — protected routes by role

## Auth Flow

```
Login form → POST /auth/login → store access_token in Redux memory
All RTK Query requests → inject Authorization: Bearer <token> header
Token expiry → auto-refresh via /auth/refresh (reads httpOnly cookie)
Logout → clear Redux state + call /auth/logout
```
