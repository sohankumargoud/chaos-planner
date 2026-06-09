# Chaos Planner — Full-Stack Project

> **Operations-first event management platform for college clubs and community organizers.**

---

## Quick Start

### Prerequisites
| Tool | Version |
|---|---|
| Java JDK | 17+ |
| Maven | 3.8+ |
| Node.js | 18+ |
| PostgreSQL | 14+ |

---

### 1. Database Setup

```bash
# Create database
psql -U postgres -c "CREATE DATABASE chaos_planner;"

# Run schema
psql -U postgres -d chaos_planner -f database/schema.sql

# Seed demo data
psql -U postgres -d chaos_planner -f database/seed.sql
```

---

### 2. Backend (Spring Boot)

```bash
cd backend

# Edit DB credentials if needed
# src/main/resources/application.properties → spring.datasource.*

# Run
mvn spring-boot:run
```

Backend runs on **http://localhost:8080**  
Swagger UI: **http://localhost:8080/swagger-ui.html**

---

### 3. Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on **http://localhost:5173**

---

## Demo Accounts

| Role | Email | Password |
|---|---|---|
| Admin | admin@chaos.dev | Admin@123 |
| User | alice@example.com | password |
| User | bob@example.com | password |
| User | carol@example.com | password |

> **Note:** OTP codes are logged to the Spring Boot console — check the terminal output.

---

## Project Structure

```
chaos-planner/
├── frontend/           # React 18 + Vite
│   └── src/
│       ├── auth/       # AuthContext, ProtectedRoute
│       ├── layouts/    # AdminLayout, UserLayout
│       ├── pages/      # public/, admin/, user/
│       └── services/   # API service layer
├── backend/            # Spring Boot 3 + Java 17
│   └── src/main/java/com/chaosplanner/
│       ├── controller/ # REST controllers
│       ├── service/    # Business logic
│       ├── repository/ # JPA repositories
│       ├── entity/     # JPA entities
│       ├── dto/        # Request/Response DTOs
│       ├── security/   # JWT filter, UserDetailsService
│       ├── config/     # Security, CORS, OpenAPI
│       └── exception/  # Global exception handler
└── database/
    ├── schema.sql      # PostgreSQL schema
    └── seed.sql        # Demo data
```

---

## Key Features

| Module | Description |
|---|---|
| Auth | Separate admin/user login, OTP signup verification, JWT, forgot password |
| Events | Full CRUD, publish/pause/cancel, category, venue, room |
| Registrations | Open or approval-based, waitlist auto-promotion, QR on approve |
| Volunteers | Shift roles, slot tracking, understaffed detection |
| Rooms | Conflict detection, venue management |
| QR Check-In | Unique token per registrant, scan → instant check-in |
| Announcements | Priority levels (NORMAL/HIGH/URGENT), audience targeting |
| Analytics | Dashboard metrics, fill rates, conflict counts |

---

## API Endpoints

| Prefix | Description |
|---|---|
| `POST /api/auth/signup` | Create account |
| `POST /api/auth/verify-otp` | Verify OTP |
| `POST /api/auth/user/login` | User JWT login |
| `POST /api/auth/admin/login` | Admin JWT login |
| `GET /api/admin/events` | List all events (admin) |
| `POST /api/admin/events` | Create event |
| `GET /api/admin/analytics/dashboard` | Dashboard metrics |
| `POST /api/admin/checkins/scan` | Scan QR code |
| `GET /api/user/events` | Browse published events |
| `POST /api/user/events/{id}/register` | Register for event |

Full API: **http://localhost:8080/swagger-ui.html**

---

## Configuration

### Backend (`application.properties`)
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/chaos_planner
spring.datasource.username=postgres
spring.datasource.password=postgres
app.jwt.secret=<base64-secret>
app.jwt.expiration-ms=86400000
app.otp.expiry-minutes=10
app.otp.provider=CONSOLE    # Change to TWILIO/SENDGRID for production
```

### Frontend (`.env`)
```
VITE_API_BASE_URL=http://localhost:8080
```

---

## Plugging in a Real OTP Provider

In `OtpService.java`, replace the `deliverOtp()` method body:

```java
// Twilio example
Message.creator(
    new PhoneNumber(destination),
    new PhoneNumber(twilioNumber),
    "Your Chaos Planner code: " + code
).create();
```

---

*Built with ❤️ for college clubs — no more event-day chaos.*
# chaos-planner
