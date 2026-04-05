import { Server } from "socket.io";
let io;

export const initSocket = (server) => {

  io = new Server(server, {
    cors: {
      origin: [
        "https://stu-portal-frontend.vercel.app",
        "https://teacher-portal-eta.vercel.app",
        "http://localhost:3000",
        "http://localhost:3001",
      ],
      credentials: true
    }
  });

  return io;
};

export const getIO = () => io;