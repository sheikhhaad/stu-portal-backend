import express from "express";
import {
  createAnnouncement,
  getAnnouncements,
  getTeacherAnnouncements,
} from "../controller/nnouncementcontroller.js";
const router = express.Router();
router.post("/create", createAnnouncement);
router.get("/", getAnnouncements);
router.get("/:teacherId/course/:courseId", getTeacherAnnouncements);
export default router;
