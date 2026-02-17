import requestIp from "request-ip"
import { UAParser } from "ua-parser-js"
import geoip from "geoip-lite"
import transporter from "../config/mail.js"

export const sendLoginAlert = async (req, email) => {
  const ip = requestIp.getClientIp(req)

  const parser = new UAParser(req.headers["user-agent"])
  const result = parser.getResult()

  const browser = result.browser.name || "Unknown"
  const os = result.os.name || "Unknown"

  const device = result.device.model
    ? `${result.device.vendor} ${result.device.model}`
    : `${browser} on ${os}`

  let location = "Localhost"

  if (ip !== "127.0.0.1" && ip !== "::1") {
    const geo = geoip.lookup(ip)
    if (geo) location = `${geo.city}, ${geo.country}`
  }

  const time = new Date().toLocaleString()

  const text = `
New login detected

Device: ${device}
Browser: ${browser}
OS: ${os}
Location: ${location}
IP: ${ip}
Time: ${time}
`

  await transporter.sendMail({
    from: process.env.EMAIL,
    to: email,
    subject: "Login Alert",
    text
  })
}
