import { Server } from "socket.io";

export let io; // export to share across controllers

export const initSocket = (server) => {
  io = new Server(server, {
    cors: { origin: "http://localhost:3000" }, // React frontend
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });

  return io;
};

// Emit events anywhere
export const sendRealtime = (event, data) => {
  if (!io) {
    console.log("Socket not initialized");
    return;
  }
  io.emit(event, data);
};
