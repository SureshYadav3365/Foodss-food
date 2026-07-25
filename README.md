# FoodHub - Food Delivery Application

A full-stack food delivery web application inspired by Zomato/Swiggy, built with React, Node.js, Express, and MongoDB.

## Features

- Modern responsive homepage with hero, categories, and featured sections
- JWT authentication (User, Restaurant Owner, Admin roles)
- Restaurant listing with search and filters
- Food menu browsing with veg/non-veg filters
- Shopping cart with persistent local storage
- Checkout with address management and coupon system
- Online payment UI (Card, UPI, Wallet, COD)
- Real-time order tracking with status timeline
- User profile and address management
- Order history
- Wishlist
- Restaurant owner dashboard (menu & order management)
- Admin dashboard (CRUD for restaurants, foods, coupons, categories)
- Reviews and ratings
- Beautiful animations with Framer Motion

## Tech Stack

| Frontend | Backend |
|----------|---------|
| React 18 + Vite | Node.js + Express |
| Redux Toolkit | MongoDB + Mongoose |
| Tailwind CSS | JWT Authentication |
| Framer Motion | REST APIs |
| Axios | bcrypt, Helmet, Rate Limiting |

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)

### 1. Clone & Install

```bash
# Backend
cd backend
npm install
cp .env.example .env   # Edit MONGODB_URI and JWT_SECRET

# Frontend
cd ../frontend
npm install
```

### 2. Seed Database

```bash
cd backend
npm run seed
```

### 3. Run Development Servers

```bash
# Terminal 1 - Backend (port 5000)
cd backend
npm run dev

# Terminal 2 - Frontend (port 5173)
cd frontend
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| User | user@fooddelivery.com | user123 |
| Admin | admin@fooddelivery.com | admin123 |
| Restaurant | restaurant@fooddelivery.com | restaurant123 |

## Demo Coupons

- `WELCOME50` - 50% off (max ₹150, min order ₹199)
- `FLAT100` - Flat ₹100 off (min order ₹399)
- `FOODIE20` - 20% off (max ₹80, min order ₹299)

## Project Structure

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed architecture documentation.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login |
| GET | /api/restaurants | List restaurants |
| GET | /api/foods | List food items |
| POST | /api/orders | Place order |
| GET | /api/orders/:id | Track order |
| GET | /api/coupons/validate/:code | Validate coupon |

## License

MIT
