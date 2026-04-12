# 🚀 TaskForge

**TaskForge** is a modern full-stack task management application built using the **MERN stack**.
It allows users to manage tasks efficiently with authentication, filtering, analytics, and real-time reminders.

---

## ✨ Features

### 🔐 Authentication

* User registration & login (JWT-based)
* Google OAuth login
* Secure password hashing using bcrypt
* Forgot & Reset Password via email

### 📝 Task Management

* Create, update, delete tasks
* Mark tasks as completed
* Add description, due date, and priority
* Edit tasks with modal UI

### 🔍 Filtering & Sorting

* Search tasks by title
* Filter by:

  * Priority (Low / Medium / High)
  * Status (Completed / Pending)
* Sort by:

  * Newest
  * Due date

### 📊 Analytics Dashboard

* Total, completed, and pending tasks
* Completion percentage
* Priority distribution (Pie chart)
* Task status comparison (Bar chart)

### 🔔 Real-Time Notifications

* Socket.IO integration
* Automatic reminders **1 day before due date**
* Live notification system in UI

### 🎨 UI/UX

* Responsive design
* Dark-themed dashboard
* Interactive task cards
* Modal-based task creation/editing

---

## 🛠️ Tech Stack

### Frontend

* React (Vite)
* Axios
* Recharts (for analytics)
* CSS (custom styling)

### Backend

* Node.js
* Express.js
* MongoDB + Mongoose
* JWT Authentication
* Passport (Google OAuth)
* Socket.IO (real-time updates)
* Nodemailer (email service)

---
Frontend

frontend/
├── src/
│   ├── components/        
│   │   ├── Header.jsx
│   │   ├── ProfileMenu.jsx
│   │   ├── ProfileMenu.css
│   │   ├── TaskCard.jsx
│   │   ├── TaskCard.css
│   │   ├── TaskList.jsx
│   │   └── TaskList.css
│   │
│   ├── context/           
│   │   └── SocketContext.jsx
│   │
│   ├── pages/             
│   │   ├── Dashboard.jsx
│   │   ├── Dashboard.css
│   │   ├── Login.jsx
│   │   ├── Login.css
│   │   ├── Register.jsx
│   │   ├── Register.css
│   │   ├── ForgotPassword.jsx
│   │   ├── ForgotPassword.css
│   │   ├── ResetPassword.jsx
│   │   └── reset.css
│   │
│   ├── services/          
│   │
│   ├── App.jsx            
│   ├── main.jsx           
│   └── index.css          
│
├── index.html
├── package.json
├── package-lock.json
├── eslint.config.js
└── .gitignore



---
Backend

taskforge/
│
├── backend/
│   ├── routes/
│   ├── models/
│   ├── config/
│   ├── utils/
│   └── app.js
│
├── frontend/
│   ├── src/
│   ├── package.json
│
├── .gitignore
└── README.md
















---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/Mesandu2007/TaskForge
cd taskforge
```

---

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```env
PORT=3000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key

EMAIL_HOST=your_email_host
EMAIL_PORT=your_email_port
EMAIL_USER=your_email
EMAIL_PASS=your_password

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

Run backend:

```bash
npm run dev
```

---

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 🔗 API Endpoints

### Auth

* POST `/auth/register`
* POST `/auth/login`
* POST `/auth/forgot-password`
* POST `/auth/reset-password/:token`
* GET `/auth/google/callback`

### Tasks

* GET `/tasks`
* POST `/tasks`
* PUT `/tasks/:id`
* DELETE `/tasks/:id`

---

## 🔌 Real-Time System (Socket.IO)

* Users connect via socket after login
* Backend tracks active users
* Reminder job triggers notifications
* Frontend listens for `"reminder"` events

---



## 🚀 Future Improvements

* Push notifications (browser/mobile)
* AI-based productivity insights
* Drag & drop task management
* Team collaboration features
* Task categories & tags

---

## 👨‍💻 Author

Developed by **Mesandu**

---

## 📄 License

This project is licensed under the MIT License.

---
