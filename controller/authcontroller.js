import sendLoginAlert from "../utils/loginAlert.js";

export const loginUser = async (req, res) => {
  const { stuId, password, email } = req.body
  console.log(stuId, password, email);

  if (!email || !password || !stuId) {
    return res.status(400).json({ msg: "Please enter all fields" })
  }
  try {
    await sendLoginAlert(req, email)
    res.json({ msg: "Login success" })
  } catch (error) {
    console.error("Error sending login alert:", error)
    res.json({ msg: "Login failed (Alert failed)" })
  }
}
