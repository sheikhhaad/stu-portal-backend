import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema(
  {
    student_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student", // Student model ka reference
      required: true,
    },
    course_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course", // Course model ka reference
      required: true,
    },
    enrolled_at: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

const Enrollment = mongoose.model("Enrollment", enrollmentSchema);

export default Enrollment;
