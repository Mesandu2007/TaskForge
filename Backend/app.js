process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const connectDB = require('./config/db');

// ✅ NEW: required for socket.io
const http = require('http');
const { Server } = require('socket.io');

// 1. Load env
dotenv.config();

// 2. Connect DB
connectDB();

// 3. Create app
const app = express();

// 4. Middleware
app.use(cors({
  origin: "http://localhost:5173", // your React app
  credentials: true
}));
app.use(express.json());

// 5. Session
app.use(session({
  secret: process.env.JWT_SECRET || 'secret',
  resave: false,
  saveUninitialized: true
}));

// 6. Passport
require('./config/passport');
app.use(passport.initialize());
app.use(passport.session());

// 7. Routes
app.use('/auth', require('./routes/auth'));
app.use('/tasks', require('./routes/tasks'));

app.get('/', (req, res) => {
  res.send("API Running...");
});

// =======================
// 🔥 SOCKET.IO SETUP
// =======================

// create server from app
const server = http.createServer(app);

// create socket server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173"
  }
});

// store connected users (Map is more efficient for frequent lookups)
const users = new Map(); 

// connection
io.on('connection', (socket) => {
  console.log("User connected:", socket.id);

  // frontend sends userId after login
  socket.on('register', (userId) => {
    // Store userId on the socket itself for easy retrieval on disconnect
    socket.userId = userId;
    
    // Handle multiple connections for the same user (e.g., multiple tabs)
    if (!users.has(userId)) {
      users.set(userId, new Set());
    }
    users.get(userId).add(socket.id);
    
    console.log(`User registered: ${userId} (Socket: ${socket.id})`);
  });

  socket.on('disconnect', () => {
    console.log("User disconnected:", socket.id);

    if (socket.userId && users.has(socket.userId)) {
      const userSockets = users.get(socket.userId);
      userSockets.delete(socket.id);
      if (userSockets.size === 0) {
        users.delete(socket.userId);
      }
    }
  });
});

// make io globally accessible
app.set('io', io);
app.set('users', users);


const startReminderJob = require('./utils/reminder');
startReminderJob(app);



const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Error: Port ${PORT} is already in use. Try a different port or kill the process using it.`);
    process.exit(1);
  } else {
    console.error('Server error:', err);
  }
});