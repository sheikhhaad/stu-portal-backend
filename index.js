import express from "express"
import authRoutes from "./routes/authroute.js"
import cors from "cors"
import dotenv from "dotenv"

dotenv.config()

const app = express()

app.use(express.json())
app.use(cors({
  origin: ["http://localhost:3000", "https://stu-portal-frontend.vercel.app"],
  credentials: true
}))


app.get("/", (req, res) => {
  res.send("Hello World!")
})

app.use("/api/auth", authRoutes)

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`)
})
