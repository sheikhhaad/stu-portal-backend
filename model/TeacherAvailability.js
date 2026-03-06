// models/TeacherAvailability.js

import mongoose from "mongoose";

const teacherAvailabilitySchema = new mongoose.Schema(
  {
    teacher_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    start_time: {
      type: String,
      required: true,
    },
    end_time: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("TeacherAvailability", teacherAvailabilitySchema);
