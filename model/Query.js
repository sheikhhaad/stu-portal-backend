import mongoose from "mongoose";

const querySchema = new mongoose.Schema(
  {
    student_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    course_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    query: {
      type: String,
      required: true,
    },
    teacher_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "resolved"],
      default: "pending",
    },
    answer: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

querySchema.index({ student_id: 1 });
querySchema.index({ teacher_id: 1 });
querySchema.index({ course_id: 1 });

const Query = mongoose.model("Query", querySchema);
export default Query;
