import express from "express";
import {
  getAllStudent,
  getStudentById,
  loginStudent,
  logoutStudent,
  registerStudent,
} from "../controller/authcontroller.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", loginStudent);
router.post("/register", registerStudent);
router.post("/logout", logoutStudent);
router.get("/students", getAllStudent);
router.get("/student/me", authMiddleware, getStudentById);

router.post("/user", authMiddleware, (req, res) => {
  res.json({ message: "Access granted", user: req.user });
});

export default router;
