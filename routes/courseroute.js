import express from "express";
import { createCourse } from "../controller/coursecontroller.js";
import { getAllCourses } from "../controller/coursecontroller.js";
import { getSingleCourse } from "../controller/coursecontroller.js";
import { updateCourse } from "../controller/coursecontroller.js";
import { deleteCourse } from "../controller/coursecontroller.js";

const router = express.Router();

router.post("/create", createCourse);
router.get("/all", getAllCourses);
router.get("/:id", getSingleCourse);
router.put("/:id", updateCourse);
router.delete("/:id", deleteCourse);

export default router;
