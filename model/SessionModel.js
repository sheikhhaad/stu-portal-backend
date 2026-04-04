// models/SessionModel.js

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

    slot_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TeacherAvailability",
      required: true,
    },

    duration: {
      type: Number,
      default: 15,
    },

    requested_time: {
      type: String,
      required: true,
    },

    session_start: {
      type: String,
      required: true,
    },

    session_end: {
      type: String,
      required: true,
    },

    meeting_link: {
      type: String,
    },

    meeting_id: {
      type: String,
    },

    status: {
      type: String,
      enum: ["pending", "accepted"],
      default: "pending",
    },
  },
  { timestamps: true },
);

// double booking protection
sessionBookingSchema.index(
  {
    teacher_id: 1,
    session_start: 1,
  },
  {
    unique: true,
    partialFilterExpression: { status: "accepted" },
  },
);

sessionBookingSchema.index({ student_id: 1 });
sessionBookingSchema.index({ teacher_id: 1 });

export default mongoose.model("SessionBooking", sessionBookingSchema);
