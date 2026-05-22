# IdeaVault Server

Backend REST API for IdeaVault, a startup idea sharing platform.
 node server start
◇ injected env (9) from .env // tip: ⌘ suppress logs { quiet: true }
Server running on port 5000

## Live URL

- Backend API: https://ideavaultclient.vercel.app/

## Core Features

- JWT authentication (register, login, logout, current user)
- Google sign-in verification via Firebase Admin SDK
- Idea CRUD with ownership guard
- Comment CRUD with ownership guard
- Interaction tracking (comment, bookmark, like)
- Idea listing with search, category filter, sorting, pagination
- Trending ideas endpoint with score-based ranking
- Public home content endpoint
- Centralized validation and error handling
- Security middleware stack (helmet, cors, rate limit, cookie parser)

## Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT + bcryptjs
- Firebase Admin SDK
- express-validator

## Folder Structure

```txt
server/
├── config/
├── controllers/
├── middlewares/
├── models/
├── routes/
├── services/
├── utils/
├── validations/
├── package.json
└── server.js
```

## API Base Path

All feature routes are under `/api`.

## Route Modules

### Auth

- POST `/api/auth/register`
- POST `/api/auth/login`
- POST `/api/auth/google`
- GET `/api/auth/me`
- POST `/api/auth/logout`

### Users

- GET `/api/users/profile`
- PUT `/api/users/profile`
- POST `/api/users/change-password`
- DELETE `/api/users/profile`

### Ideas

- POST `/api/ideas`
- GET `/api/ideas`
- GET `/api/ideas/trending`
- GET `/api/ideas/:id`
- GET `/api/ideas/my-ideas/:email`
- PATCH `/api/ideas/:id`
- DELETE `/api/ideas/:id`

### Comments

- POST `/api/comments`
- GET `/api/comments/:ideaId`
- PATCH `/api/comments/:id`
- DELETE `/api/comments/:id`

### Interactions

- GET `/api/interactions/:email`
- POST `/api/interactions`

### Public

- GET `/api/public/home-content`

## Environment Variables

Create `.env` inside `server`:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_strong_jwt_secret

CLIENT_URL=http://localhost:3000
CLIENT_URLS=http://localhost:3000,http://127.0.0.1:3000

FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_CLIENT_EMAIL=your_firebase_client_email
FIREBASE_PRIVATE_KEY=your_firebase_private_key

DNS_SERVERS=8.8.8.8,1.1.1.1
NODE_ENV=development
```

Notes:

- `MONGODB_URI` and `JWT_SECRET` are required for startup.
- For Google auth, set all Firebase variables together.
- Keep PEM markers in `FIREBASE_PRIVATE_KEY`.
- `DNS_SERVERS` helps avoid MongoDB Atlas SRV DNS failures in some environments.

## Installation

```bash
npm install
```

## Run Server

```bash
npm run dev
```

Server default: `http://localhost:5000`

## Scripts

- `npm run dev` - start server
- `npm start` - start server in standard mode
- `npm run lint` - placeholder lint command

## Security and Middleware Flow

- Helmet for security headers
- CORS with allowlist and credentials
- JSON parser with request size limit
- Cookie parser
- API rate limiter on `/api`
- Route handlers
- Not found handler
- Centralized error handler

## Health Check

- GET `/`
- Expected response: `IdeaVault Server is Running`

## Verification Checklist

Before deployment:

```bash
node --check server.js
npm run dev
```

Manual checks:

- Auth flow: register, login, me, logout
- Idea flow: create, list, update, delete
- Comment flow: create, update, delete
- Interaction flow: add and list
- Ownership checks for protected updates/deletes
- Public home-content endpoint

## Deployment Notes

- Set all required environment variables on host.
- Use strong JWT secret in production.
- Ensure frontend origin is included in `CLIENT_URL` or `CLIENT_URLS`.
- Set `NODE_ENV=production` in production environment.
