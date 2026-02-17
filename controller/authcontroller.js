import { sendLoginAlert } from "../utils/loginAlert.js"

export const loginUser = async (req, res) => {
  const { StuId, password,email } = req.body
  console.log(StuId, password,email);
  

//   const user = await User.findOne({ email })
//   if (!user) return res.status(401).json({ msg: "Invalid credentials" })

//   const isMatch = await user.comparePassword(password)
//   if (!isMatch) return res.status(401).json({ msg: "Invalid credentials" })

  await sendLoginAlert(req, email)

  res.json({ msg: "Login success" })
}
