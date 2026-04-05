// controllers/messageController.js
import Message from "../model/Message.js";
import { getIO } from "../utils/socket.js"; // ✅ import socket instance

// GET chat messages for a teacher-student pair
export const getMessages = async (req, res) => {
  const { studentId, teacherId } = req.params;
  const chat_id = `${studentId}_${teacherId}`;

  try {
    const messages = await Message.find({ chat_id }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};

// SEND message (with real‑time emit)
export const sendMessage = async (req, res) => {
  const { sender_id, sender_role, student_id, teacher_id, message } = req.body;

  if (!student_id || !teacher_id || !message || !sender_id || !sender_role) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const chat_id = `${student_id}_${teacher_id}`;

  try {
    const newMsg = await Message.create({
      chat_id,
      sender_id,
      sender_role,
      message,
    });

    const io = getIO();
    io.emit("new_message", newMsg);

    res.json({ success: true, data: newMsg });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send message" });
  }
};