import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    chat_id: {
      type: String,
      required: true,
    },
    sender_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    sender_role: {
      type: String,
      enum: ["student", "teacher"],
    },
    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

messageSchema.index({ chat_id: 1, createdAt: 1 });

export default mongoose.model("Message", messageSchema);
