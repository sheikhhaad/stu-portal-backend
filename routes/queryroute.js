import express from "express";
import {
  createQuery,
  getAllQueries,
  getStudentCourseQueries,
  updateQuery,
} from "../controller/createQuery.js";

const router = express.Router();

router.post("/create", createQuery);
router.get("/all", getAllQueries);
router.get("/:studentId/course/:courseId", getStudentCourseQueries);
router.put("/:id", updateQuery);

export default router;
