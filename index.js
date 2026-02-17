import express from "express"
import authRoutes from "./routes/authroute.js"
import cors from "cors"
import dotenv from "dotenv"

dotenv.config()

const app = express()

// Sab domains ke liye allow
app.use(
  cors({
    origin: "*", // koi bhi domain allow
    methods: ["GET", "POST", "PUT", "DELETE"],
    // credentials: true // cookies/session use nahi kar rahe to hata do
  })
)

app.use(express.json())

app.get("/", (req, res) => {
  res.send("Hello World!")
})

app.use("/api/auth", authRoutes)

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`)
})
