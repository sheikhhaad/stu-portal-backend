import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    rollNumber: String,
    password: String,
    email: String,
    cnic: String,
    name: String,
    phone: String,
    profilePic: String,
    shazaib_student: Boolean,
  },
  { timestamps: true },
);

const Student = mongoose.model("Student", studentSchema);

export default Student;
