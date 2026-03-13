import express from "express";
import {
  getAllStudent,
  getStudentById,
  getTeacherByCourseId,
  getTeacher,
  loginStudent,
  loginTeacher,
  logoutStudent,
  registerStudent,
  registerTeacher,
} from "../controller/authcontroller.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", loginStudent);
router.post("/register", registerStudent);
router.post("/logout", logoutStudent);
router.get("/students", getAllStudent);
router.get("/student/me", authMiddleware, getStudentById);

router.post("/teacher/register", registerTeacher);
router.post("/teacher/login", loginTeacher);
router.get("/teacher/me", authMiddleware, getTeacher);
router.get("/teacher/:id", getTeacherByCourseId);
router.post("/user", authMiddleware, (req, res) => {
  res.json({ message: "Access granted", user: req.user });
});

export default router;
