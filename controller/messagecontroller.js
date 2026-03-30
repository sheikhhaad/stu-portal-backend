import Message from "../model/Message.js";

export const getMessages = async (req, res) => {
  const { studentId, teacherId } = req.params;

  const chat_id = `${studentId}_${teacherId}`;

  try {
    const messages = await Message.find({ chat_id }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};
export const sendMessage = async (req, res) => {
  const { sender_id, sender_role, student_id, teacher_id, message } = req.body;

  if (!student_id || !teacher_id || !message) {
    return res.status(400).json({ error: "Missing fields" });
  }

  // chat_id always consistent
  const chat_id = `${student_id}_${teacher_id}`;

  try {
    const newMsg = await Message.create({
      chat_id,
      sender_id,
      sender_role,
      message,
    });

    res.json({ success: true, data: newMsg });
  } catch (err) {
    res.status(500).json({ error: "Failed to send message" });
  }
};
