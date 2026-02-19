# MERN Finance Tracker

A personal finance tracking app built with the MERN stack. Track income and expenses, manage categories, view statistics with filters, and use JWT auth with rate limiting.

## Features

- **Auth**: Sign up, login, JWT in HttpOnly cookies
- **Transactions**: Add, edit, delete income/expense; filter by type, category, date range
- **Categories**: CRUD for income and expense categories, linked to transactions
- **Statistics**: Total income, total expense, balance; optional date range
- **Theme**: Light/dark mode
- **Rate limiting**: Upstash Redis–backed API limit (60 req/20s) with friendly UI feedback

## Tech Stack

| Layer   | Stack |
|---------|--------|
| Frontend | React 19, Vite 7, React Router 7, Zustand, Axios, Tailwind CSS, DaisyUI, Lucide React, React Hot Toast |
| Backend  | Node.js, Express, Mongoose, JWT, bcryptjs, cookie-parser, CORS |
| Database | MongoDB |
| Rate limit | Upstash Redis, @upstash/ratelimit |

## Project Structure

```
MERN-FinanceTracker/
├── backend/                 # Express API
│   └── src/
│       ├── config/          # DB, Upstash config
│       ├── controller/      # Auth, transactions, categories
│       ├── middleware/      # Auth, rate limiter
│       ├── models/          # User, Transaction, etc.
│       ├── routes/          # API routes
│       └── server.js
├── frontend/                # React + Vite
│   └── src/
│       ├── components/      # Navbar, transaction cards, stats, filters, rate-limit UI
│       ├── lib/             # Axios instance, utils
│       ├── pages/           # Home, login, signup, create/edit, detail
│       ├── store/           # authStore, themeStore
│       └── App.jsx
└── package.json             # Root scripts: build, start
```

## Requirements

- Node.js 18+
- MongoDB (local or Atlas)
- [Upstash Redis](https://upstash.com/) (optional, for rate limiting)

## Quick Start

### 1. Clone

```bash
git clone https://github.com/YH0120/MERN-FinanceTracker.git
cd MERN-FinanceTracker
```

### 2. Backend environment

Create `.env` in the `backend` folder:

```env
PORT=5001
MONGO_URI=mongodb://localhost:27017/your_db_name
# Or MongoDB Atlas: mongodb+srv://user:pass@cluster.mongodb.net/dbname

JWT_SECRET=your_random_secret_key

# Upstash Redis (optional; rate limiter may fail without these)
UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_token
```

### 3. Install and run

**Development (frontend and backend separate):**

```bash
# Install dependencies
npm install
npm install --prefix backend
npm install --prefix frontend

# Start backend (default http://localhost:5001)
npm run start --prefix backend
# Or with hot reload: npm run dev --prefix backend

# In another terminal, start frontend (default http://localhost:5173)
npm run dev --prefix frontend
```

**Production build and run:**

```bash
# Install and build frontend
npm run build

# Start backend (serves frontend/dist)
NODE_ENV=production npm run start --prefix backend
```

Use `http://localhost:5173` in development and the backend URL (e.g. `http://localhost:5001`) in production.

## API Overview

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/signup` | Sign up |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/logout` | Logout |
| GET  | `/api/auth/me` | Current user (auth required) |
| GET  | `/api/transactions` | List transactions (query: type, category, startDate, endDate) |
| GET  | `/api/transactions/statistics` | Stats (query: startDate, endDate) |
| POST | `/api/transactions` | Create transaction |
| GET  | `/api/transactions/:id` | Get transaction |
| PUT  | `/api/transactions/:id` | Update transaction |
| DELETE | `/api/transactions/:id` | Delete transaction |
| GET  | `/api/categories` | List categories (income/expense) |
| POST | `/api/categories` | Create category |
| PUT  | `/api/categories/:id` | Update category |
| DELETE | `/api/categories/:id` | Delete category |

Auth: JWT in HttpOnly cookie; requests must use `credentials: 'include'`.
