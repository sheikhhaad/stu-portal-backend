import express from "express";
import {
  createQuery,
  getAllQueries,
  getStudentCourseQueries,
  updateQuery,
  getTeacherCourseQueries,
} from "../controller/createQuery.js";

const router = express.Router();

router.post("/create", createQuery);
router.get("/all", getAllQueries);
router.get("/:studentId/course/:courseId", getStudentCourseQueries);
router.put("/:id", updateQuery);
router.get("/teacher/:teacherId/course/:courseId", getTeacherCourseQueries);
export default router;
