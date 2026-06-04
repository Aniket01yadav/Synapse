# Architecture

Synapse is a full-stack social network application split into a React/Vite frontend, an Express API, and MongoDB persistence through Mongoose. The backend uses a route-controller-service-model structure so HTTP concerns, business rules, and database access stay separate.

## System Flow

```text
React frontend
  |
  | Axios JSON requests
  | Authorization: Bearer <jwt>
  v
Express API
  |
  | Routes -> Controllers -> Services
  v
Mongoose models
  |
  v
MongoDB
```

## Key Design Tradeoffs

### 1. Service Layer Over Direct Controller Logic

The backend keeps route handlers thin and moves business rules into service modules such as `friendship.service.js`, `recommendation.service.js`, `hobby.service.js`, and `auth.service.js`.

Tradeoff: this creates more files and a little more navigation overhead, but it makes the recommendation, friendship, popularity, and hobby rules easier to test and change without rewriting HTTP handlers.

### 2. Computed Recommendation Scores Instead of Persisted Recommendations

Friend and hobby recommendations are generated on request using current users, friendships, hobbies, and popularity scores.

Tradeoff: on-demand calculation keeps recommendations fresh and avoids stale cached recommendation documents, but it performs more database reads and in-memory scoring work per request. This is acceptable for the current project size; larger datasets would need pagination, indexing, or a background recommendation job.

### 3. JWT Authentication Stored Client-Side

The frontend stores the JWT in local storage and sends it through an Axios interceptor on protected API requests.

Tradeoff: this keeps the auth flow simple for a single-page app and avoids server-side sessions, but local storage tokens require careful XSS prevention. A production version should review token storage, expiry handling, refresh tokens, HTTPS, and stricter CORS settings.

## Rejected Alternatives

### 1. Rejected: Embedding Business Logic in React Components

Recommendation scoring, popularity updates, friendship linking, and hobby normalization could have been implemented in the frontend.

Why rejected: client-side business rules are easy to bypass and hard to keep consistent across users. Keeping them in the API ensures every client receives the same results and database updates remain authoritative.

### 2. Rejected: One Large Express File

The API could have been implemented with all routes, validation, database calls, and response handling in `server.js`.

Why rejected: the project has several related domains: auth, users, hobbies, graph data, friendships, feedback, popularity, and recommendations. A single file would make changes riskier and would hide ownership boundaries. The current folder structure keeps the code easier to read and submit for review.

## Backend Responsibilities

- `routes/`: maps endpoint paths to controllers.
- `controllers/`: converts HTTP input into service calls and sends JSON responses.
- `services/`: contains business logic for authentication, users, hobbies, friendships, graph data, feedback, popularity, and recommendations.
- `models/`: defines MongoDB schemas for users, hobbies, and feedback.
- `middleware/`: handles authentication, validation, and error formatting.
- `helpers/`: contains reusable scoring and token utilities.

## Frontend Responsibilities

- `pages/`: top-level views for login, registration, profile, network graph, and recommendations.
- `components/`: reusable UI pieces such as navigation, protected routes, user forms, friend lists, and graph nodes.
- `context/` and `hooks/`: authentication state and access helpers.
- `services/api.js`: shared Axios client with JWT authorization.

