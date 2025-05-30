import express from 'express';
import http from 'http';
import dotenv from 'dotenv';
import cors from 'cors';
import AuthrRoutes from './routes/AuthRoutes.js';
import MessageRoutes from './routes/MessageRoutes.js';
import { Server } from 'socket.io';

dotenv.config();

const app = express();
const server = http.createServer(app);

// ✅ Use Render's port if available
const PORT = process.env.PORT || 3001;

// Static files
app.use("/uploads/images", express.static("uploads/images"));
app.use("/uploads/recordings", express.static("uploads/recordings", {
  setHeaders: (res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
  }
}));

global.onlineUsers = new Map();

// CORS config
app.use(cors({
  origin: "https://zaptalk-tikz.onrender.com",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
  transports: ["websocket", "polling"]
}));

app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use("/api/auth", AuthrRoutes);
app.use("/api/messages", MessageRoutes);

// Socket.io config
const io = new Server(server, {
  cors: {
    origin: "https://zaptalk-tikz.onrender.com",
    methods: ['GET', 'POST'],
  }
});

io.on("connection", (socket) => {
  global.chatSocket = socket;

  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
    socket.broadcast.emit("online-users", {
      onlineUsers: Array.from(onlineUsers.keys()),
    });
  });

  socket.on("send-msg", ({ from, to, message }) => {
    const sendUserSocket = onlineUsers.get(to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", { from, message });
    }
  });

  socket.on("outgoing-voice-call", ({ from, to, roomId, callType }) => {
    const sendUserSocket = onlineUsers.get(to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("incoming-voice-call", { from, roomId, callType });
    }
  });
