# Attendance Management System with Reports

This is a complete MERN stack application featuring role-based authentication, subject-wise attendance marking, automated threshold warnings using Ethereal email, and a premium modern UI built with Tailwind CSS.

## Architecture
- **Frontend**: React.js, Tailwind CSS, React Router, Axios, Lucide React
- **Backend**: Node.js, Express.js, Mongoose, JWT, Nodemailer
- **Database**: MongoDB

## How to Run

### 1. Backend Setup
```bash
cd backend
npm install
# Ensure you have a .env file with MONGO_URI and JWT_SECRET
npm run start # or node server.js
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm start
```

### 3. Default Admin Creation
Currently, the `/api/auth/register-admin` endpoint is open for you to create the initial admin account. You can create one via Postman or use the following command while the backend is running:
```bash
curl -X POST http://localhost:5000/api/auth/register-admin \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "email": "admin@example.com", "password": "password"}'
```
You can then log in with username `admin` and password `password`.

### 4. Email Previews
Emails (absences, low attendance) are mocked using ethereal.email. Check the terminal where the backend is running for preview URLs when an email is "sent".
