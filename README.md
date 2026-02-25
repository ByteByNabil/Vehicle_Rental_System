# 🚗 Vehicle Rental System Backend API

A secure and scalable backend API built with:

**Node.js • Express.js • TypeScript • PostgreSQL • JWT • bcrypt • Vercel**

---

# 🌍 Live Links

**Live Deployment:**
[https://vehicles-rental-system-five.vercel.app](https://vehicles-rental-system-five.vercel.app)

**GitHub Repository:**
[https://github.com/ByteByNabil/Vehicle_Rental_System](https://github.com/ByteByNabil/Vehicle_Rental_System)

---

# 📌 Project Overview

The Vehicle Rental System Backend API manages:

- User authentication & authorization
- Vehicle inventory management
- Rental bookings
- Role-based access control (Admin & Customer)
- Automatic booking return logic

The system ensures:

- 🔐 Secure authentication using JWT
- 🔒 Encrypted passwords using bcrypt
- 🛡️ Role-based access control
- 📦 Modular and scalable architecture

---

# 🏗️ Code Architecture

## 📁 Project Structure

```
Vehicle_Rental_System/
│
├── dist/                     # Compiled JavaScript (Production)
│
├── src/                      # Source Code (TypeScript)
│   │
│   ├── config/               # App & Database Configuration
│   │   ├── db.ts
│   │
│   ├── middleware/           # Global Middlewares
│   │   ├── auth.ts
│   │   ├── logger.ts
│   │
│   ├── modules/              # Feature-Based Modules
│   │   ├── auth/
│   │   │   ├── auth.controllers.ts
│   │   │   ├── auth.routes.ts
│   │   │   ├── auth.services.ts
│   │   │
│   │   ├── users/
│   │   │   ├── users.controllers.ts
│   │   │   ├── users.routes.ts
│   │   │   ├── users.services.ts
│   │   │
│   │   ├── vehicles/
│   │   │   ├── vehicles.controllers.ts
│   │   │   ├── vehicles.routes.ts
│   │   │   ├── vehicles.services.ts
│   │   │
│   │   ├── bookings/
│   │       ├── bookings.controllers.ts
│   │       ├── bookings.routes.ts
│   │       ├── bookings.services.ts
│   │
│   ├── types/
│   │   ├── index.ts
│   │
│   ├── app.ts
│   ├── server.ts
│
├── .env
├── package.json
├── tsconfig.json
└── vercel.json
```

---

## 🧱 Architecture Pattern

### 1️⃣ Modular Architecture

Each feature is isolated inside its own module:

- Auth
- Users
- Vehicles
- Bookings

Benefits:

- Clean separation of concerns
- Easy scalability
- Easier maintenance
- Enterprise-ready structure

---

### 2️⃣ Layered Pattern

Controller → Service → Database

**Controllers**

- Handle HTTP requests & responses
- Validate input
- Call services

**Services**

- Business logic
- Database queries
- Data transformation

**Database Layer**

- PostgreSQL connection via `config/db.ts`
- Uses `pool.query()`

---

### 3️⃣ Middleware Layer

- JWT Authentication
- Role-Based Authorization
- Request Logger

---

### 4️⃣ Type Safety

Using TypeScript for:

- Strong typing
- Interfaces
- Safer request/response handling
- Reduced runtime errors

---

# ✨ Core Features

- ✅ User Registration & Login
- ✅ JWT Authentication
- ✅ Role-Based Authorization (Admin / Customer)
- ✅ Users CRUD
- ✅ Vehicles CRUD
- ✅ Booking Management
- ✅ Auto-Return Logic
- ✅ Vehicle Availability Tracking
- ✅ Secure Password Hashing

---

# 🔌 API Base URL

Local:

```
http://localhost:5000/api/v1
```

Live:

```
https://vehicles-rental-system-five.vercel.app/api/v1
```

---

# 🔐 Authentication API

### Sign Up

POST /api/v1/auth/signup

### Sign In

POST /api/v1/auth/signin

Returns JWT token for protected routes.

---

# 👤 Users API

| Method | Endpoint   | Access       |
| ------ | ---------- | ------------ |
| GET    | /users     | Admin        |
| GET    | /users/:id | Admin / Self |
| PUT    | /users/:id | Admin / Self |
| DELETE | /users/:id | Admin        |

---

# 🚗 Vehicles API

| Method | Endpoint      | Access |
| ------ | ------------- | ------ |
| GET    | /vehicles     | Public |
| GET    | /vehicles/:id | Public |
| POST   | /vehicles     | Admin  |
| PUT    | /vehicles/:id | Admin  |
| DELETE | /vehicles/:id | Admin  |

---

# 📅 Bookings API

| Method | Endpoint      | Access           |
| ------ | ------------- | ---------------- |
| POST   | /bookings     | Customer         |
| GET    | /bookings     | Admin            |
| GET    | /bookings/my  | Customer         |
| PUT    | /bookings/:id | Admin / Customer |

---

## 🔁 Auto-Return Logic

Bookings automatically update when:

```
rent_end_date < CURRENT_DATE
```

The system:

- Marks booking as returned
- Updates vehicle availability

---

# 🧪 Example API Response

### Successful Login

```
{
  "success": true,
  "message": "User logged in successfully",
  "token": "JWT_TOKEN",
  "user": {
    "id": 1,
    "name": "Nabil",
    "email": "nabil@email.com",
    "role": "customer"
  }
}
```

---

# 📦 Environment Variables

| Variable          | Description                    |
| ----------------- | ------------------------------ |
| PORT              | Server port                    |
| CONNECTION_STRING | PostgreSQL database connection |
| JWT_SECRET        | Secret key for JWT             |

---

# ⚙️ Setup Instructions

1. Clone Repository

```
git clone https://github.com/ByteByNabil/Vehicle_Rental_System.git
```

2. Install Dependencies

```
npm install
```

3. Create .env file

4. Run Development Server

```
npm run dev
```

---

# 👨‍💻 Author

Nabil
Backend Developer
GitHub: [https://github.com/ByteByNabil](https://github.com/ByteByNabil)
