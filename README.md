# IdeaVault Backend

Professional REST API backend for **IdeaVault - Startup Idea Sharing Platform**.

## Live Server URL
- Add your deployed backend URL here.

## Features
- JWT authentication (register, login, me, logout)
- Google login via Firebase Admin SDK
- Idea CRUD with ownership protection
- Comments CRUD with ownership protection
- Interactions tracking (comment, bookmark, like)
- Search, filter, pagination, and sorting for ideas
- Trending ideas endpoint with score-based ranking
- Centralized error handling and route not-found handler
- Request validation with express-validator
- Security middlewares: Helmet, CORS, rate limiting, cookie parser

## Technologies Used
- Node.js
- Express.js
- MongoDB Atlas + Mongoose
- JWT + bcryptjs
- Firebase Admin SDK
- express-validator
- helmet
- express-rate-limit
- dotenv
- cors
- cookie-parser

## Folder Structure
```txt
server/
├── config/
│   ├── db.js
│   └── firebaseAdmin.js
├── controllers/
│   ├── authController.js
│   ├── ideaController.js
│   ├── commentController.js
│   └── interactionController.js
├── middlewares/
│   ├── verifyToken.js
│   ├── validateRequest.js
│   ├── errorHandler.js
│   ├── notFound.js
│   └── ownershipGuard.js
├── models/
│   ├── User.js
│   ├── Idea.js
│   ├── Comment.js
│   └── Interaction.js
├── routes/
│   ├── authRoutes.js
│   ├── ideaRoutes.js
│   ├── commentRoutes.js
│   └── interactionRoutes.js
├── services/
│   ├── trendingService.js
│   └── queryBuilder.js
├── utils/
│   ├── generateToken.js
│   ├── sendResponse.js
│   ├── catchAsync.js
│   └── apiFeatures.js
├── validations/
│   ├── authValidation.js
│   ├── ideaValidation.js
│   ├── commentValidation.js
│   └── interactionValidation.js
├── .env
├── .gitignore
├── package.json
└── server.js
```

## API Endpoints
### Auth
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/google
- GET /api/auth/me
- POST /api/auth/logout

### Ideas
- POST /api/ideas
- GET /api/ideas
- GET /api/ideas/trending
- GET /api/ideas/:id
- GET /api/ideas/my-ideas/:email
- PATCH /api/ideas/:id
- DELETE /api/ideas/:id

### Comments
- POST /api/comments
- GET /api/comments/:ideaId
- PATCH /api/comments/:id
- DELETE /api/comments/:id

### Interactions
- GET /api/interactions/:email
- POST /api/interactions

## Installation Guide
1. Navigate to the server folder.
2. Install dependencies:
   - npm install
3. Create/update .env using the section below.
4. Start development server:
   - npm run dev

## Environment Variables Setup
```env
PORT=5000
MONGODB_URI=your_mongodb_connection
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:3000
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_CLIENT_EMAIL=your_client_email
DNS_SERVERS=8.8.8.8,1.1.1.1
NODE_ENV=development
```

## Deployment Instructions
### Render/Railway
1. Add all environment variables.
2. Build command: npm install
3. Start command: npm start

### Vercel Serverless
- Move to serverless handlers or use Vercel-compatible Express adapter before deploying.
- Keep environment variables in Vercel project settings.

## Health Check
- GET /
- Response: IdeaVault Server is Running
