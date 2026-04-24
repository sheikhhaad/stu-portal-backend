import requestIp from "request-ip"
import { UAParser } from "ua-parser-js"
import axios from "axios"
import transporter from "../config/mail.js"

const getClientIp = (req) => {
  return (
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.socket?.remoteAddress ||
    requestIp.getClientIp(req) ||
    "Unknown"
  )
}

const getLocation = async (ip) => {
  try {
    if (!ip || ip === "127.0.0.1" || ip === "::1") {
      return "Localhost"
    }

    const { data } = await axios.get(
      `https://ipinfo.io/${ip}?token=${process.env.IPINFO_TOKEN}`
    )

    return `${data.city || "Unknown City"}, ${data.country || ""}`
  } catch {
    return "Unknown location"
  }
}

const sendLoginAlert = async (req, email) => {
  // 1. IP
  const ip = getClientIp(req)

  // 2. User agent
  const parser = new UAParser(req.headers["user-agent"])
  const result = parser.getResult()

  const browser = result.browser.name || "Unknown"
  const os = result.os.name || "Unknown"

  const device = result.device.model
    ? `${result.device.vendor} ${result.device.model}`
    : `${browser} on ${os}`

  // 3. Location
  const location = await getLocation(ip)

  // 4. Time
  const time = new Date().toLocaleString("en-US", {
    timeZone: "Asia/Karachi",
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  })

  // 5. Email text
  const text = `
New login detected

Device: ${device}
Browser: ${browser}
OS: ${os}
Location: ${location}
IP: ${ip}
Time: ${time}
`

  // 6. Send email
  await transporter.sendMail({
    from: process.env.EMAIL,
    to: email,
    subject: "Login Alert",
    text,
  })
}

export default sendLoginAlert