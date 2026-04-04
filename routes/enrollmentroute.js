import express from "express";
import {
  createEnrollment,
  deleteEnrollment,
  getCourseEnrollments,
  getStudentEnrollments,
} from "../controller/enrollementcontroller.js";
import {
  createTeacherEnrollment,
  getAllTeacherEnrollments,
  getTeacherEnrollments,
  getTeacherById,
} from "../controller/TeacherEnrollment.js";
import { getTeacherInfo } from "../controller/authcontroller.js";

const router = express.Router();

// Add a new enrollment
router.post("/create", createEnrollment);

// Get all courses a student is enrolled in
router.get("/student/:studentId", getStudentEnrollments);

// Get all students enrolled in a course
router.get("/course/:courseId", getCourseEnrollments);

// Delete an enrollment
router.delete("/:id", deleteEnrollment);

router.post("/teacher/create", createTeacherEnrollment);

router.get("/teacher/all", getAllTeacherEnrollments);
router.get("/teacher/all/:teacherId", getTeacherById);
router.get("/teacher/:courseId", getTeacherEnrollments);

router.get("/teacher/info/:teacherId", getTeacherInfo);
export default router;
