import Message from "../model/Message.js";
import Query from "../model/Query.js";

// Get messages of a query
export const getMessages = async (req, res) => {
  try {
    const { queryId } = req.params;

    const messages = await Message.find({
      query_id: queryId,
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ msg: "Failed to fetch messages" });
  }
};

// Send message
export const sendMessage = async (req, res) => {
  try {
    const { query_id, sender_id, sender_role, message } = req.body;

    if (!query_id || !sender_id || !sender_role || !message) {
      return res.status(400).json({ msg: "All fields required" });
    }

    const newMessage = await Message.create({
      query_id,
      sender_id,
      sender_role,
      message,
    });

    // Query status auto update
    await Query.findByIdAndUpdate(query_id, {
      status: "pending",
    });

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ msg: "Message sending failed" });
  }
};
