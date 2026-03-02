import express from "express";
import {
  getAllStudent,
  getStudentById,
  getTeacherByCourseId,
  loginStudent,
  loginTeacher,
  logoutStudent,
  registerStudent,
  registerTeacher,
} from "../controller/authcontroller.js";

const router = express.Router();

router.post("/login", loginStudent);
router.post("/register", registerStudent);
router.post("/logout", logoutStudent);
router.get("/students", getAllStudent);
router.get("/student/:id", getStudentById);

router.post("/teacher/register", registerTeacher);
router.post("/teacher/login", loginTeacher);
router.get("/teacher/:id", getTeacherByCourseId);

export default router;
