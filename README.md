# Synapse

Synapse is a full-stack social network application for managing user profiles, hobbies, friendships, network visualization, and friend recommendations.

The application is split into a Node.js/Express API and a React/Vite frontend. MongoDB is used for persistence, JWT is used for authentication, and React Flow powers the network graph.

## Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [API Overview](#api-overview)
- [Testing](#testing)
- [Production Notes](#production-notes)
- [Troubleshooting](#troubleshooting)

## Features

- User registration, login, and authenticated sessions
- Profile management with editable user details
- Hobby management with case-insensitive matching
- Friendship linking and unlinking
- Interactive network graph
- Friend search and recommendation cards
- Recommendation reasons based on shared hobbies and mutual friends
- Popularity score calculation
- Protected frontend routes
- Centralized API client with JWT authorization

## Tech Stack

### Backend

- Node.js
- Express
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Jest

### Frontend

- React
- Vite
- React Router
- React Flow
- Tailwind CSS
- Axios
- React Hot Toast

## Architecture

```text
Frontend (React)
  |
  | HTTP requests with Bearer token
  v
Backend API (Express)
  |
  | Mongoose models and services
  v
MongoDB
```

The backend follows a route-controller-service-model structure:

- Routes define API endpoints.
- Controllers handle request and response flow.
- Services contain business logic.
- Models define MongoDB schemas.
- Middleware handles authentication, validation, and errors.

The frontend is organized around pages, shared components, context, hooks, and API services.

## Project Structure

```text
Synapse/
  Backend/
    src/
      app.js
      config/
      controllers/
      helpers/
      middleware/
      models/
      routes/
      services/
    tests/
    package.json
    server.js

  Frontend/
    src/
      components/
      context/
      hooks/
      pages/
      services/
    package.json
    vite.config.js

  README.md
```

## Getting Started

### Prerequisites

- Node.js 20 or newer recommended
- npm
- MongoDB connection string

### 1. Clone the repository

```bash
git clone <repository-url>
cd Synapse
```

### 2. Install backend dependencies

```bash
cd Backend
npm install
```

### 3. Configure backend environment

Create `Backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/synapse
JWT_SECRET=replace-with-a-secure-secret
NODE_ENV=development
```

### 4. Start the backend

```bash
npm start
```

The API runs on:

```text
http://localhost:5000
```

### 5. Install frontend dependencies

Open a second terminal:

```bash
cd Frontend
npm install
```

### 6. Configure frontend environment

Create `Frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

### 7. Start the frontend

```bash
npm run dev
```

The frontend runs on the URL printed by Vite, usually:

```text
http://localhost:5173
```

## Environment Variables

### Backend

| Variable | Required | Description |
| --- | --- | --- |
| `PORT` | No | API server port. Defaults to `5000`. |
| `MONGO_URI` | Yes | MongoDB connection string. |
| `JWT_SECRET` | Yes | Secret used to sign JWT tokens. |
| `NODE_ENV` | No | Runtime environment. Defaults to `development`. |

### Frontend

| Variable | Required | Description |
| --- | --- | --- |
| `VITE_API_URL` | Yes | Backend API base URL. Example: `http://localhost:5000/api`. |

## Scripts

### Backend

Run from `Backend/`.

```bash
npm start
```

Starts the Express server.

```bash
npm test
```

Runs the Jest test suite.

### Frontend

Run from `Frontend/`.

```bash
npm run dev
```

Starts the Vite development server.

```bash
npm run build
```

Creates a production build in `Frontend/dist`.

```bash
npm run lint
```

Runs ESLint.

```bash
npm run preview
```

Serves the production build locally.

## API Overview

All protected endpoints require:

```http
Authorization: Bearer <token>
```

### Authentication

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/auth/register` | Register a new user. |
| `POST` | `/api/auth/login` | Log in and receive a JWT. |
| `GET` | `/api/auth/me` | Get the authenticated user. |

### Users

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/users` | List users. |
| `GET` | `/api/users/:id` | Get a user by id. |
| `POST` | `/api/users` | Create a user. |
| `PUT` | `/api/users/:id` | Update a user. |
| `DELETE` | `/api/users/:id` | Delete a user. |

### Friendships

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/users/:id/link` | Link two users as friends. |
| `DELETE` | `/api/users/:id/unlink` | Remove a friendship. |

### Hobbies

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/hobbies` | List known hobbies. |
| `POST` | `/api/hobbies/:id` | Add a hobby to a user. |
| `DELETE` | `/api/hobbies/:id` | Remove a hobby from a user. |

### Graph

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/graph` | Return nodes and edges for network visualization. |

### Recommendations

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/recommendations/:id` | Get friend and hobby recommendations. |
| `POST` | `/api/recommendations/:id/feedback` | Submit recommendation feedback. |

## Testing

Run backend tests:

```bash
cd Backend
npm test
```

Run frontend checks:

```bash
cd Frontend
npm run lint
npm run build
```

## Production Notes

Before deploying this application, review the following:

- Use a strong `JWT_SECRET`.
- Store environment variables in a secret manager or deployment platform settings.
- Configure MongoDB network access and authentication properly.
- Restrict CORS origins instead of allowing all origins.
- Add request rate limiting.
- Add pagination for large user, hobby, and graph responses.
- Add indexes for fields used in filtering and lookup, such as `email`, `friends`, `hobbies`, and `username`.
- Serve the frontend build through a static host or reverse proxy.
- Run the backend behind a process manager or container runtime.
- Enable HTTPS at the load balancer, proxy, or hosting provider.

## Troubleshooting

### Backend cannot connect to MongoDB

- Check `MONGO_URI`.
- Confirm MongoDB is running or reachable.
- Confirm the database user has the correct permissions.

### Frontend requests fail

- Check `VITE_API_URL`.
- Confirm the backend is running.
- Confirm the user is logged in and the token exists in local storage.

### Protected pages redirect to login

- Log in again to refresh the token.
- Check that `/api/auth/me` returns the current user.

### Network graph does not show expected users

- Confirm users have friendships.
- Refresh the graph from the Network page.
- Check `/api/graph` from the backend.

## License

This project is currently marked as `ISC` in `Backend/package.json`.
