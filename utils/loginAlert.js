import requestIp from "request-ip"
import { UAParser } from "ua-parser-js"
import geoip from "geoip-lite"
import transporter from "../config/mail.js"

const sendLoginAlert = async (req, email) => {
  // 1. Get client IP
  const ip = requestIp.getClientIp(req)

  // 2. Parse user-agent
  const parser = new UAParser(req.headers["user-agent"])
  const result = parser.getResult()

  const browser = result.browser.name || "Unknown"
  const os = result.os.name || "Unknown"

  const device = result.device.model
    ? `${result.device.vendor} ${result.device.model}`
    : `${browser} on ${os}`

  // 3. Get location from IP
  let location = "Localhost"
  if (ip !== "127.0.0.1" && ip !== "::1") {
    const geo = geoip.lookup(ip)
    if (geo) location = `${geo.city || "Unknown City"}, ${geo.country}`
  }

  // 4. Format login time
  const time = new Date().toLocaleString("en-US", {
    timeZone: "Asia/Karachi", // Change to your preferred timezone
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  })

  // 5. Prepare alert email text
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
    text
  })
}

export default sendLoginAlert