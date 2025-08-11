# Skillsphere

A backend project built with **Node.js**, **Express**, and **MySQL** to connect skilled service providers with customers who can book their services.  
This project demonstrates core backend development skills — authentication, CRUD APIs, relational database design, validation, and Docker-based deployment.

---

## Features

- **User Authentication**
  - Signup/Login with JWT authentication
  - Role-based access (Provider / Customer)
  - Secure password hashing with bcrypt

- **Skill Management**
  - Providers can create, update, and delete skills
  - Public skill listing and search
  - Pagination and filtering

- **Booking System**
  - Customers can book skills for a specific date & time
  - Providers can confirm or reject bookings
  - Conflict prevention using SQL transactions
  - Booking status tracking (PENDING → CONFIRMED → COMPLETED)

- **Validation & Security**
  - Request validation with custom middleware
  - Prevents invalid data entry
  - Role-based route protection

- **Database**
  - MySQL relational schema
  - Tables: Users, Skills, Bookings
  - Foreign keys and indexing for performance

- **Dockerized Setup**
  - MySQL & API run in isolated containers
  - Environment variables for configuration

---

## Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MySQL
- **Authentication:** JWT, bcrypt
- **Deployment:** Docker & docker-compose
- **Validation:** Express-validator

---

## API Endpoints

### Auth
| Method | Endpoint           | Description            | Auth Required |
|--------|----------------    |----------------------  |---------------|
| POST   | `/api/auth/signup` | Register new user      | No            |
| POST   | `/api/auth/login`  | Login user & get token | No            |

### Skills
| Method | Endpoint          | Description          | Auth Required |
|--------|----------------   |----------------------|---------------|
| GET    | `/api/skills`     | List all skills      | No            |
| GET    | `/api/skills/:id` | Get skill by ID      | No            |
| POST   | `/api/skills`     | Create skill         | Provider only |
| PUT    | `/api/skills/:id` | Update skill         | Provider only |
| DELETE | `/api/skills/:id` | Delete skill         | Provider only |

### Bookings
| Method | Endpoint                      | Description           | Auth Required     |
|--------|------------------------------ |-----------------------|---------------    |
| POST   | `/api/bookings`               | Create booking        | Customer only     |
| POST   | `/api/bookings/:id/confirm`   | Confirm booking       | Provider only     |
| POST   | `/api/bookings/:id/complete`  | Mark booking complete | Provider only     |
| GET    | `/api/bookings/:id`           | Get booking details   | Customer/Provider |

---

## Database Schema

**Users Table**
- id (PK)
- name
- email
- password (hashed)
- role (`provider` or `customer`)

**Skills Table**
- id (PK)
- provider_id (FK → Users.id)
- title
- description
- price

**Bookings Table**
- id (PK)
- skill_id (FK → Skills.id)
- customer_id (FK → Users.id)
- provider_id (FK → Users.id)
- start_time
- duration_mins
- price_snapshot
- status (PENDING / CONFIRMED / COMPLETED)
- notes

---

## Setup Instructions

### Local Setup
```bash
# Install dependencies
npm install

# Create .env file
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=1234
DB_NAME=skillsphere
JWT_SECRET=your_jwt_secret

# Run server
npm run dev
