import express from "express";
import { createCourse } from "../controller/coursecontroller.js";
import { getAllCourses } from "../controller/coursecontroller.js";
import { getSingleCourse } from "../controller/coursecontroller.js";
import { updateCourse } from "../controller/coursecontroller.js";
import { deleteCourse } from "../controller/coursecontroller.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", authMiddleware, createCourse);
router.get("/all", getAllCourses);
router.get("/:id", authMiddleware, getSingleCourse);
router.put("/:id", authMiddleware, updateCourse);
router.delete("/:id", authMiddleware, deleteCourse);

export default router;
