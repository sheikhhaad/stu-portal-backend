import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema(
  {
    teacher_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },
    course_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);
const Announcement = mongoose.model("Announcement", announcementSchema);

export default Announcement;
