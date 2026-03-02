// routes/availabilityRoutes.js

import express from "express";
import {
  bookSlot,
  createAvailability,
  getallSession,
  getSessionBySlotId,
  getSessionByStudentSlotId,
  getTeacherAvailability,
} from "../controller/availabilityController.js";
const router = express.Router();

// Teacher creates slot
router.post("/create", createAvailability);

// Student gets teacher slots
router.get("/:teacherId", getTeacherAvailability);

// Student books slot
router.put("/book/:slotId", bookSlot);
router.get("/slot/:slotId", getSessionBySlotId);
router.get("/student/:studentId", getSessionByStudentSlotId);
router.get("/fetch/all", getallSession);

export default router;
