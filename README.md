# 🚀 Career Plus - Job & Internship Application Tracker

**Career Plus** is a full-stack job application tracking platform built with **React (Vite + Tailwind CSS)** on the frontend and **Spring Boot (Java 17 + JPA)** backed by **SQLite** on the backend.

---

## 🌟 Key Features

- **6-Step Sequential Application Wizard**: Company & Job Info, Recruiter Details, Compensation & Resume Upload, Interview Details, Skills & Notes, and Final Summary Review.
- **Manual & Profile Resume Uploads**: Browse and attach `.pdf`, `.doc`, or `.docx` files directly from your computer or select stored resumes from your profile.
- **Status Filter Focused Column Zoom Mode**: Selecting a stage (`Applied`, `Interviewing`, `Offered`, `Rejected`) zooms and highlights that specific column while smoothly dimming others.
- **LPA Salary Format**: Input compensation in Lakhs Per Annum (`e.g. 12 LPA`).
- **Real-time Notes Drawer**: Edit existing notes and append new application logs in real-time.
- **Full REST Integration & Security**: BCrypt password hashing, JWT Bearer Token authentication, Google OAuth 2.0 integration, and instant SQLite persistence.

---

## 📂 Repository Structure

```text
Career-plus/
├── frontend/                 # React (Vite + Tailwind CSS)
│   ├── src/
│   │   ├── components/       # Modals, Kanban Board, Job Cards, Navbar
│   │   ├── pages/            # Landing Page, Login, Sign Up
│   │   └── services/         # REST API Integration Helper (api.js)
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── backend/                  # Spring Boot (Java 17 + SQLite)
    ├── src/
    │   ├── main/java/com/careerplus/
    │   │   ├── config/       # Spring Security & JWT Config
    │   │   ├── controller/   # REST Controllers (Auth, Applications, Resumes)
    │   │   ├── dto/          # Data Transfer Objects
    │   │   ├── model/        # JPA Entities (User, Application, Resume)
    │   │   └── repository/   # Spring Data Repositories
    │   └── resources/
    │       └── application.properties
    ├── career_plus.db        # SQLite Database File
    └── pom.xml
```

---

## 🛠️ Quick Setup & Run Instructions

### 1. Run React Frontend (Port 3000)
```bash
cd frontend
npm install
npm run dev
```
Open **[http://localhost:3000/](http://localhost:3000/)** in your browser.

### 2. Run Spring Boot Backend (Port 8080)
```bash
cd backend
mvn spring-boot:run
```
*(Or import `backend/` into Spring Tool Suite / Eclipse and run as Spring Boot App).*

---

## 🔒 License & Copyright

© 2026 **Career Plus Team**. All Rights Reserved.
