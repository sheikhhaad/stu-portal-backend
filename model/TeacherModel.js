import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema(
  {
    name: String,

    email: {
      type: String,
      unique: true,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },
    profilePic: String,
    phone: String,
  },
  { timestamps: true },
);

const Teacher = mongoose.model("Teacher", teacherSchema);

export default Teacher;
