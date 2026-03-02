import express from "express";
import authRoutes from "./routes/authroute.js";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import queryRoutes from "./routes/queryroute.js";
import courseRoutes from "./routes/courseroute.js";
import enrollmentRoutes from "./routes/enrollmentroute.js";
import messageRoutes from "./routes/messageroute.js";
import availableroutes  from "./routes/availabilityRoutes.js";

dotenv.config();
const app = express();
connectDB();
// Sab domains ke liye allow
app.use(
  cors({
    origin: "https://stu-portal-frontend.vercel.app", // frontend origin
    credentials: true, // <--- must be true
  }),
);
app.use(cookieParser());

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/availability", availableroutes);
app.use("/api/auth", authRoutes);
app.use("/api/queries", queryRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/messages", messageRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
