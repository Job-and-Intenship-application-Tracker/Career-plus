# CareerPlus - Full Stack Job & Internship Tracker (Microservices Architecture)

CareerPlus is an enterprise full-stack application tracking platform built with **React, Tailwind CSS, Spring Boot Microservices, Spring Cloud Gateway, and SQLite**.

---

## 🏛️ Microservices & API Gateway Architecture

The backend is decomposed into 3 decoupled Spring Boot Microservices:

```
                               React Frontend (Port 3000)
                                           │
                                           ▼
                          ┌─────────────────────────────────┐
                          │     API Gateway (Port 8080)     │
                          └────────────────┬────────────────┘
                                           │
             ┌─────────────────────────────┴─────────────────────────────┐
             ▼                                                           ▼
┌─────────────────────────┐                                 ┌─────────────────────────┐
│  Auth Service (Port 8081)│                                 │ App Service (Port 8082) │
│  - User Authentication  │                                 │ - Applications & Cards  │
│  - JWT & Google OAuth   │                                 │ - Resumes & Analytics   │
│  - SQLite auth.db       │                                 │ - SQLite app.db         │
└─────────────────────────┘                                 └─────────────────────────┘
```

---

## 🚀 Services Overview

### 1. `api-gateway` (Port 8080 - Central Gateway)
- **Role**: Central entry point for all frontend API calls.
- **Routing Rules**:
  - `/api/auth/**` $\rightarrow$ `http://localhost:8081` (`auth-service`)
  - `/api/applications/**` $\rightarrow$ `http://localhost:8082` (`application-service`)
  - `/api/users/**` $\rightarrow$ `http://localhost:8082` (`application-service`)

### 2. `auth-service` (Port 8081 - Authentication Microservice)
- **Role**: Dedicated microservice for User Registration, Login, Password Reset, BCrypt Hashing, Google OAuth Sync, and JWT Token Issuance.
- **Database**: SQLite (`auth_service.db`)

### 3. `application-service` (Port 8082 - Core Application & Balance Microservice)
- **Role**: Dedicated microservice for 6-Step Job Applications, Kanban Stages, Recruiter Follow-ups, Resumes, Priority Engine, and Analytics.
- **Database**: SQLite (`application_service.db`)

---

## 🛠️ How to Run Microservices

1. **Start Auth Service**:
   ```bash
   cd backend/services/auth-service
   mvn spring-boot:run
   ```

2. **Start Application Service**:
   ```bash
   cd backend/services/application-service
   mvn spring-boot:run
   ```

3. **Start API Gateway**:
   ```bash
   cd backend/services/api-gateway
   mvn spring-boot:run
   ```

4. **Start React Frontend**:
   ```bash
   cd frontend
   npm run dev
   ```
