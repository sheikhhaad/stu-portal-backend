import mongoose from "mongoose";

const sessionBookingSchema = new mongoose.Schema(
  {
    student_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    teacher_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },

    duration: {
      type: Number, // 15 or 30
      required: true,
    },

    requested_time: {
      type: String,
      required: true,
    },

    session_start: {
      type: String,
    },

    session_end: {
      type: String,
    },
    meeting_link: {
      type: String,
      required: true,
    },
    slot_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TeacherAvailability",
      required: true,
    },
    meeting_id: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "completed"],
      default: "pending",
    },
  },
  { timestamps: true },
);

const SessionBooking = mongoose.model("SessionBooking", sessionBookingSchema);

export default SessionBooking;
