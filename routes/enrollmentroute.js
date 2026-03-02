import express from "express";
import {
  createEnrollment,
  deleteEnrollment,
  getCourseEnrollments,
  getStudentEnrollments,
} from "../controller/enrollementcontroller.js";

const router = express.Router();

// Add a new enrollment
router.post("/create", createEnrollment);

// Get all courses a student is enrolled in
router.get("/student/:studentId", getStudentEnrollments);

// Get all students enrolled in a course
router.get("/course/:courseId", getCourseEnrollments);

// Delete an enrollment
router.delete("/:id", deleteEnrollment);

export default router;
