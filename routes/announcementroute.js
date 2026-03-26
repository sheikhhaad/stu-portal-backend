import express from "express";
import {
  createAnnouncement,
  deleteAnnouncement,
  getAnnouncements,
  getTeacherAnnouncements,
  updateAnnouncement,
} from "../controller/nnouncementcontroller.js";
import authMiddleware from "../middleware/authMiddleware.js";
const router = express.Router();
router.post("/create", authMiddleware, createAnnouncement);
router.get("/", getAnnouncements);
router.get(
  "/:teacherId/course/:courseId",
  authMiddleware,
  getTeacherAnnouncements,
);
router.delete("/deleteannouncement/:id", authMiddleware, deleteAnnouncement);
router.put("/updateannouncement/:id", authMiddleware, updateAnnouncement);
export default router;
