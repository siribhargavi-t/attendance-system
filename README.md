# 📊 AttendPro: Attendance Management System with Reports

AttendPro is a premium, full-stack MERN application that provides a modern, role-based attendance management system. It features subject-wise attendance marking, automated email alerts for low attendance, student leave request workflows, interactive data visualizations, and PDF/CSV report exports. The interface features a premium dark/light mode responsive UI built with Tailwind CSS and Framer Motion page animations.

---

## ✨ Features

### 👤 Role-Based Portals & Dashboards
*   **Admin Portal**:
    *   **Global Overview**: Main dashboard displaying student counts, faculty counts, overall attendance rates, and registration statistics.
    *   **Student CRUD**: Full student management console to register or delete student profiles.
    *   **Attendance Reports**: Filterable logs of all attendance records across subjects, with single-click exports to **PDF** (via jsPDF/AutoTable) and **CSV**.
*   **Faculty Portal**:
    *   **Attendance Marking**: Interactive subject-wise attendance marking panel with date selectors and real-time present/absent status toggling.
    *   **Leave Management**: Review, approve, or reject student leave requests with custom comments.
*   **Student Portal**:
    *   **Personal Attendance Dashboard**: Interactive progress ring and subject-wise breakdown of attendance rates.
    *   **Leave Requests**: Apply for leaves with start/end dates, reasons, and target faculty advisors. Track request status (Pending, Approved, Rejected) in real time.
    *   **Notification Feed**: Real-time inbox for warning logs, threshold drops, and leave status updates.

### 📧 Automated Email Warning System
*   **Threshold Alerts**: Automated backend processes check attendance thresholds (e.g., falling below 75%).
*   **Email Previews**: Mock emails (absences, threshold warnings) are sent using `nodemailer` and visualized instantly via `ethereal.email` preview URLs printed to the server terminal.

### 🎨 Visuals & UX
*   **Premium Glassmorphic Design**: Sleek dark mode option, customized typography, vibrant neon borders, and polished gradients.
*   **Micro-Animations**: Enhanced UX powered by `framer-motion` for page entries, page transitions, and hover effects.
*   **Theme Toggle**: Seamless light/dark mode system context state tracking.

---

## 🛠️ Tech Stack

*   **Frontend**: React (v19), React Router (v7), Tailwind CSS, Framer Motion, Recharts, Chart.js
*   **Backend**: Node.js, Express.js, JWT Authentication, Nodemailer
*   **Database**: MongoDB (via Mongoose ORM)

---

## 🚀 Getting Started

### 1. Database & Environment Setup
Create a `.env` file inside the `/backend` folder with the following variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
```

### 2. Backend Startup
```bash
cd backend
npm install
npm start
```
*The database automatically triggers a seeder on connection, populating the default admin, faculty, student, and sample logs.*

### 3. Frontend Startup
```bash
cd frontend
npm install
npm start
```
*Runs the React application locally at `http://localhost:3000`.*

---

## 🔑 Demo Access Credentials
Use these pre-seeded accounts to explore the portals. **All accounts use the password `password`**:

| Portal | Email | Role |
| :--- | :--- | :--- |
| **Admin Portal** | `admin@example.com` | `admin` |
| **Faculty Portal** | `faculty@example.com` | `faculty` |
| **Student Portal** | `student@example.com` | `student` |

---

## 📁 Project Directory Structure

```
├── backend/
│   ├── config/          # Database & configuration connections
│   ├── controllers/     # Authentication, Admin, Attendance, Leave, & Mail controllers
│   ├── middleware/      # Authentication validation and authorization layers
│   ├── models/          # Mongoose Schemas (User, Student, Attendance, Leave)
│   ├── routes/          # Express route endpoints
│   ├── utils/           # DB Seeder & mail templates
│   └── server.js        # Main Express server configuration
│
└── frontend/
    ├── public/          # Index template and assets
    └── src/
        ├── components/  # Layout structures, sidebars, and theme-wrappers
        ├── context/     # User Auth & Theme state contexts
        ├── pages/       # Dashboard routes, login/register, admin & faculty panels
        └── services/    # Axios configuration instance
```
