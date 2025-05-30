import express from 'express'
import http from 'http';
import dotenv from 'dotenv'
import cors from 'cors'
import AuthrRoutes from './routes/AuthRoutes.js';
import MessageRoutes from "./routes/MessageRoutes.js";
import { Server, Socket } from 'socket.io'
dotenv.config();
const app = express();
const server = http.createServer(app)
const port = 3001;
app.use("/uploads/images", express.static("uploads/images"))
app.use("/uploads/recordings", express.static("uploads/recordings", {
  setHeaders: (res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
  }
}));


global.onlineUsers = new Map();
app.use(cors({
  origin: "http://localhost:3000", // ✅ Allow frontend to access backend
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
  transports: ["websocket", "polling"],
}
));
app.use(express.json());
app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.use("/api/auth", AuthrRoutes)
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ['GET', 'POST'],
  }
});
io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
    socket.broadcast.emit("online-users", {
      onlineUsers: Array.from(onlineUsers.keys()),
    })

  });
  socket.on("send-msg", (data) => {
    const { from, to, message } = data;
    const sendUserSocket = onlineUsers.get(to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", { from, message });
    }
  });
  socket.on("outgoing-voice-call", (data) => {
    const { from, to, roomId, callType } = data; // Destructure these variables from 'data'
    const sendUserSocket = onlineUsers.get(to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("incoming-voice-call", {
        from, roomId, callType
      });
    }
  });

  socket.on("signout", (id) => {
    onlineUsers.delete(id);
    socket.broadcast.emit("online-users", {
      onlineUsers: Array.from(onlineUsers.keys()),
    })
  })
  socket.on("outgoing-video-call", (data) => {
    console.log("Received outgoing-voice-call event with dat a:", data);
    const { from, to, roomId, callType } = data;
    const sendUserSocket = onlineUsers.get(to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("incoming-video-call", {
        from, roomId, callType
      })
    }
  })
  socket.on("reject-video-call", (data) => {
    console.log(data)
    const { from, to } = data;
    const sendUserSocket = onlineUsers.get(from);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("video-call-rejected")
    }
  })
  socket.on("reject-voice-call", (data) => {
    const { from, to } = data;
    const sendUserSocket = onlineUsers.get(from);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("voice-call-rejected")
    }
  })

  socket.on("accept-incoming-call", ({ id }) => {
    const sendUserSocket = onlineUsers.get(id);
    socket.to(sendUserSocket).emit("accept-call")
    console.log("jhbc")
  })
})
app.use("/api/messages", MessageRoutes)
server.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});