import express from "express";
import {
  getTeacherByCourseId,
  getTeacher,
  loginTeacher,
  registerTeacher,
} from "../controller/authcontroller.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/teacher/register", registerTeacher);
router.post("/teacher/login", loginTeacher);
router.get("/teacher/me", authMiddleware, getTeacher);
router.get("/teacher/:id",authMiddleware, getTeacherByCourseId);

export default router;
