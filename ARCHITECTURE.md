# Food Delivery AI - Architecture

## Overview

Full-stack food delivery platform inspired by Zomato/Swiggy with customer, restaurant owner, and admin roles.

```
Food-Delivery-AI/
├── backend/                    # Node.js + Express + MongoDB API
│   ├── config/                 # DB, env configuration
│   ├── controllers/            # Request handlers
│   ├── middleware/             # Auth, validation, error handling
│   ├── models/                 # Mongoose schemas
│   ├── routes/                 # REST API routes
│   ├── utils/                  # Helpers, API responses
│   ├── seed/                   # Database seeding
│   ├── server.js               # Entry point
│   └── package.json
│
├── frontend/                   # React + Vite + Redux + Tailwind
│   ├── public/
│   └── src/
│       ├── api/                # Axios API client & endpoints
│       ├── assets/             # Static images, icons
│       ├── components/
│       │   ├── common/         # Button, Input, Modal, Loader
│       │   ├── layout/         # Navbar, Footer, Sidebar
│       │   ├── home/           # Hero, Categories, Featured
│       │   ├── restaurant/     # Cards, filters
│       │   ├── food/           # Food cards, details
│       │   ├── cart/           # Cart items, summary
│       │   └── dashboard/      # Admin & restaurant widgets
│       ├── hooks/              # Custom React hooks
│       ├── pages/
│       │   ├── auth/           # Login, Signup
│       │   ├── customer/       # Home, Restaurants, Cart, etc.
│       │   ├── restaurant/     # Restaurant dashboard
│       │   └── admin/          # Admin dashboard
│       ├── store/
│       │   ├── slices/         # Redux Toolkit slices
│       │   └── index.js        # Store configuration
│       ├── utils/              # Constants, formatters
│       ├── App.jsx             # Routes
│       └── main.jsx            # Entry point
│
├── ARCHITECTURE.md
└── README.md
```

## Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React 18, Vite, Redux Toolkit       |
| Styling    | Tailwind CSS, Framer Motion         |
| Backend    | Node.js, Express.js                 |
| Database   | MongoDB, Mongoose                   |
| Auth       | JWT (access + refresh pattern)      |
| HTTP       | Axios, REST APIs                    |

## User Roles

| Role       | Capabilities                                              |
|------------|-----------------------------------------------------------|
| `user`     | Browse, order, cart, wishlist, reviews, profile           |
| `restaurant` | Manage own restaurant, food items, view orders          |
| `admin`    | Full CRUD on restaurants, foods, coupons, users           |

## Database Schema

```
User          → name, email, password, role, addresses[], avatar
Restaurant    → name, description, cuisine, rating, image, owner, isActive
Food          → name, description, price, category, restaurant, image, isVeg
Category      → name, image, slug
Order         → user, items[], total, status, address, paymentMethod
Review        → user, restaurant/food, rating, comment
Coupon        → code, discount, type, minOrder, expiry, isActive
Wishlist      → user, foods[]
```

## API Routes

```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me

GET    /api/restaurants
GET    /api/restaurants/:id
POST   /api/restaurants          (admin/restaurant)
PUT    /api/restaurants/:id
DELETE /api/restaurants/:id

GET    /api/foods
GET    /api/foods/:id
POST   /api/foods
PUT    /api/foods/:id
DELETE /api/foods/:id

GET    /api/categories

POST   /api/orders
GET    /api/orders
GET    /api/orders/:id
PUT    /api/orders/:id/status

GET    /api/reviews/:targetId
POST   /api/reviews

GET    /api/coupons/validate/:code
POST   /api/coupons              (admin)

GET    /api/wishlist
POST   /api/wishlist/:foodId
DELETE /api/wishlist/:foodId

PUT    /api/users/profile
PUT    /api/users/addresses
```

## Order Status Flow

```
placed → confirmed → preparing → out_for_delivery → delivered
                  ↘ cancelled
```

## Frontend Routes

```
/                    Home
/login               Login
/signup              Signup
/restaurants         Restaurant listing
/restaurants/:id     Restaurant detail + menu
/food/:id            Food detail
/cart                Cart
/checkout            Checkout + payment UI
/orders              Order history
/orders/:id          Order tracking
/profile             User profile
/wishlist            Wishlist
/restaurant/dashboard Restaurant owner dashboard
/admin/dashboard     Admin dashboard
```

## Security

- Password hashing with bcrypt
- JWT in Authorization header
- Role-based route protection
- Input validation with express-validator
- Rate limiting on auth routes
- CORS configured for frontend origin
- Helmet for HTTP headers

## State Management (Redux)

```
authSlice     → user, token, isAuthenticated
cartSlice     → items, coupon, totals
restaurantSlice → list, filters, selected
foodSlice     → list, selected, search
orderSlice    → orders, current order
wishlistSlice → items
uiSlice       → loading, toasts, modals
```
