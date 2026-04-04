import { Server } from "socket.io";

export let io; // export to share across controllers

export const initSocket = (server) => {
  const allowedOrigins = process.env.FRONTEND_URL 
    ? process.env.FRONTEND_URL.split(",") 
    : [
        "http://localhost:3000",
        "http://localhost:3001",
        "https://stu-portal-frontend.vercel.app",
        "https://teacher-portal-eta.vercel.app",
      ];

  io = new Server(server, {
    cors: {
      origin: allowedOrigins,
      methods: ["GET", "POST"],
      credentials: true,
    },
    pingTimeout: 60000,
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    // Clients authenticate and join their secure room
    socket.on("join", (userId) => {
      if (userId) {
        socket.join(`user_${userId}`);
        console.log(`Socket ${socket.id} joined room user_${userId}`);
      }
    });

    // Option to join specific chat rooms
    socket.on("join_chat", (chatId) => {
      if (chatId) {
        socket.join(`chat_${chatId}`);
        console.log(`Socket ${socket.id} joined chat room chat_${chatId}`);
      }
    });

    // Leave a chat
    socket.on("leave_chat", (chatId) => {
      if (chatId) {
        socket.leave(`chat_${chatId}`);
        console.log(`Socket ${socket.id} left chat room chat_${chatId}`);
      }
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });

  return io;
};

// Generic fallback: emit events to all. (Discouraged but kept for backward compatibility)
export const sendRealtime = (event, data) => {
  if (!io) return console.log("Socket not initialized");
  io.emit(event, data);
};

// Emits event to a specific user's room
export const sendToUser = (userId, event, data) => {
  if (!io) return console.log("Socket not initialized");
  io.to(`user_${userId}`).emit(event, data);
};

// Emits event to a specific chat room
export const sendToChat = (chatId, event, data) => {
  if (!io) return console.log("Socket not initialized");
  io.to(`chat_${chatId}`).emit(event, data);
};
