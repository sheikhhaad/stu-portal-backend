import express from "express";
import { getMessages, sendMessage } from "../controller/messagecontroller.js";

const router = express.Router();

router.get("/:studentId/:teacherId", getMessages);
router.post("/send", sendMessage);

export default router;
