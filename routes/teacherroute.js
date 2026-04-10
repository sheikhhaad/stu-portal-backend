import express from "express";
import {
  // getTeacherByCourseId,
  getTeacher,
  loginTeacher,
  registerTeacher,
  TeacherInfoUpdate,
} from "../controller/authcontroller.js";
import authMiddleware from "../middleware/authMiddleware.js";
import multer from "multer";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
});

router.post("/teacher/register", registerTeacher);
router.post("/teacher/login", loginTeacher);
router.get("/teacher/me", authMiddleware, getTeacher);
// router.get("/course/:courseId",authMiddleware, getTeacherByCourseId);
router.put(
  "/teacher/update/:id",
  authMiddleware,
  upload.single("profilePic"),
  TeacherInfoUpdate,
);

export default router;
