import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    query_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Query",
      required: true,
    },
    sender_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    sender_role: {
      type: String,
      enum: ["student", "teacher"],
      required: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Message", messageSchema);
