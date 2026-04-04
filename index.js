import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authroute.js";
import teacherRoutes from "./routes/teacherroute.js";
import queryRoutes from "./routes/queryroute.js";
import courseRoutes from "./routes/courseroute.js";
import enrollmentRoutes from "./routes/enrollmentroute.js";
import messageRoutes from "./routes/messageroute.js";
import availableroutes from "./routes/availabilityRoutes.js";
import announcementRoutes from "./routes/announcementroute.js";
import sessionroutes from "./routes/sessionroute.js";
import { initSocket } from "./utils/realtime.js";

dotenv.config();
const app = express();
const server = http.createServer(app);

// Database
connectDB();

// CORS
const allowedOrigins = [
  "https://stu-portal-frontend.vercel.app",
  "https://teacher-portal-eta.vercel.app",
  "http://localhost:3000",
  "http://localhost:3001",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);

// Cookie & JSON
app.use(cookieParser());
app.use(express.json());

// Initialize socket once
initSocket(server);

// Routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/availability", availableroutes);
app.use("/api/session", sessionroutes);
app.use("/api/auth", authRoutes);
app.use("/api/auth", teacherRoutes);
app.use("/api/queries", queryRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/announcements", announcementRoutes);

// Start server (socket attached)
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
