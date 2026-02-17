import express from "express"
import authRoutes from "./routes/authroute.js"
import cors from "cors"
import dotenv from "dotenv"

dotenv.config()

const app = express()

const allowedOrigins = [
  "http://localhost:3000",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json())



app.get("/", (req, res) => {
  res.send("Hello World!")
})

app.use("/api/auth", authRoutes)

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`)
})
