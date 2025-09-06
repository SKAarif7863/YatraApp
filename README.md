# MERN Auth Scaffold + Vite React UI

This project includes a Vite + React (shadcn-ui) frontend and an Express + MongoDB API server with secure authentication (email/password, JWT access + refresh, Google OAuth 2.0).

## Contents
- Frontend: Vite React app (port 8080)
- Server: Express API in ./server (port 4000)

## Server Features
- Auth: email/password (bcrypt), JWT access + refresh tokens with rotation and token revocation
- Google OAuth 2.0 (passport-google-oauth20)
- Mongoose models (User, RefreshToken)
- Security middleware: helmet, CORS, rate-limiter, cookie httpOnly refresh token
- Central error handler, logging (morgan)
- Input validation (zod)
- Placeholder items API (/api/items)

## Environment (.env)
Copy .env.example to .env and set values:
- MONGODB_URI
- JWT_SECRET
- GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
- CORS_ORIGIN (default http://localhost:8080)

## Run locally
1) Install deps: npm i
2) Create .env from .env.example and fill values
3) Start frontend: npm run dev (http://localhost:8080)
4) Start API: npm run server:dev (http://localhost:4000)

## MongoDB Atlas setup
- Create a free cluster at https://www.mongodb.com/cloud/atlas
- Create a Database User and allow access from your IP (Network Access)
- Create a database (e.g., appdb) and get the connection string; set MONGODB_URI in .env

## Google OAuth setup
- Go to https://console.cloud.google.com/apis/credentials
- Create OAuth 2.0 Client ID (Web application)
- Authorized redirect URI: http://localhost:4000/api/auth/google/callback
- Copy Client ID/Secret into GOOGLE_CLIENT_ID/GOOGLE_CLIENT_SECRET in .env


## Auth Endpoints
- POST /api/auth/register { email, password, name }
- POST /api/auth/login { email, password }
- POST /api/auth/refresh (uses httpOnly cookie)
- POST /api/auth/logout
- GET /api/auth/me (Authorization: Bearer <access>)
- GET /api/auth/google and GET /api/auth/google/callback

## CSRF Considerations
- Refresh token is stored in httpOnly cookie, scoped to /api/auth/refresh to reduce CSRF surface
- Use SameSite=lax by default; for cross-site OAuth flows use SameSite=none;secure in production
- For state-changing requests, prefer Authorization bearer tokens and consider CSRF tokens if you accept cookie-based auth

## Docker (optional)
- Sample Dockerfile and docker-compose in ./server

## Postman
- Import docs/postman_collection.json

## Notes
- Refresh token rotation: each refresh issues a new token and revokes the previous
- Logout revokes the presented refresh token and clears cookie
- Add more routes in server/routes and controllers in server/controllers
