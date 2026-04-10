import express from "express";
import {
  getAllStudent,
  getStudent,
  getStudentById,
  loginStudent,
  logoutStudent,
  registerStudent,
  StudentInfoUpdate,
} from "../controller/authcontroller.js";
import authMiddleware from "../middleware/authMiddleware.js";
import multer from "multer";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
});

router.post("/login", loginStudent);
router.post("/register", registerStudent);
router.post("/logout", logoutStudent);
router.get("/students", getAllStudent);
router.get("/student/me", authMiddleware, getStudent);
router.put(
  "/student/update/:id",
  authMiddleware,
  upload.single("profilePic"),
  StudentInfoUpdate,
);
router.get("/student/:id", authMiddleware, getStudentById);

router.post("/user", authMiddleware, (req, res) => {
  res.json({ message: "Access granted", user: req.user });
});

export default router;
