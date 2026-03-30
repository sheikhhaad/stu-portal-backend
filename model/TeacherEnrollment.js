import mongoose from "mongoose";

let TeacherEnrollmentSchema = new mongoose.Schema(
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
  },
  { timestamps: true },
);

export default mongoose.model("TeacherEnrollment", TeacherEnrollmentSchema);
