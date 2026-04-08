import express from "express";
import {
  bookSlot,
  deleteSessions,
  getallSession,
  getSessionById,
  getSessionByStudentSlotId,
  getTeacherSession,
  updateSessionStatus,
} from "../controller/sessioncontroller.js";
const router = express.Router();

router.put("/book/:slotId", bookSlot);
router.get("/:sessionId", getSessionById);
router.get("/student/:studentId", getSessionByStudentSlotId);
router.get("/fetch/all", getallSession);
router.get("/teacher/:teacherId", getTeacherSession);

router.put("/update/:sessionId", updateSessionStatus);
router.delete("/delete/:sessionId", deleteSessions); // New endpoint

export default router;
