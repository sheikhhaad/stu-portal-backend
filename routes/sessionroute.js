import express from "express";
import {
  bookSlot,
  getallSession,
  getSessionBySlotId,
  getSessionByStudentSlotId,
  getTeacherSession,
  updateSessionStatus,
} from "../controller/sessioncontroller.js";
const router = express.Router();

router.put("/book/:slotId", bookSlot);
router.get("/slot/:slotId", getSessionBySlotId);
router.get("/student/:studentId", getSessionByStudentSlotId);
router.get("/fetch/all", getallSession);
router.get("/teacher/:teacherId", getTeacherSession);

router.put("/:sessionId", updateSessionStatus);
export default router;
