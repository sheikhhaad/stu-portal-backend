import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    rollNumber: String,
    password: String,
    email: String,
    cnic: String,
    name: String,
  },
  { timestamps: true },
);

const Student = mongoose.model("Student", studentSchema);

export default Student;
