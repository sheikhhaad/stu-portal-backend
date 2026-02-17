import express from "express"
import authRoutes from "./routes/authroute.js"
import cors from "cors"
import dotenv from "dotenv"

dotenv.config()

const app = express()
app.use(cors(
))


app.get("/", (req, res) => {
  res.send("Hello World!")
})

app.use(express.json())

app.use("/api/auth", authRoutes)

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`)
})
