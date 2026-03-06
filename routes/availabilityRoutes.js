// routes/availabilityRoutes.js

import express from "express";
import {
  createAvailability,
  getTeacherAvailability,
} from "../controller/availabilityController.js";
const router = express.Router();

// Teacher creates slot
router.post("/create", createAvailability);

// Student gets teacher slots
router.get("/:teacherId", getTeacherAvailability);

export default router;
