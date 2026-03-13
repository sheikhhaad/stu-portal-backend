import Student from "../model/StudentModel.js";
import sendLoginAlert from "../utils/loginAlert.js";
import Teacher from "../model/TeacherModel.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
export const registerStudent = async (req, res) => {
  const { rollNumber, password, email, cnic } = req.body;

  if (!rollNumber || !password || !email || !cnic) {
    return res.status(400).json({ msg: "All fields required" });
  }

  try {
    const exists = await Student.findOne({ rollNumber });

    if (exists) {
      return res.status(400).json({ msg: "Student exists" });
    }

    const student = await Student.create({
      rollNumber,
      password,
      email,
      cnic,
    });

    res.status(201).json({
      msg: "Student registered",
      student,
    });
  } catch (error) {
    res.status(500).json({ msg: "Registration failed" });
  }
};

export const loginStudent = async (req, res) => {
  const { rollNumber, password } = req.body;

  try {
    const student = await Student.findOne({ rollNumber });

    if (!student) {
      return res.status(404).json({ msg: "Student not found" });
    }

    if (password && password !== student.password) {
      return res.status(401).json({ msg: "Wrong password" });
    }

    await sendLoginAlert(req, student.email);

    const token = jwt.sign(
      { id: student._id, role: "student" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 60 * 60 * 1000,
    });

    res.status(200).json({
      msg: "Login success",
      student: {
        _id: student._id,
        rollNumber: student.rollNumber,
        email: student.email,
        cnic: student.cnic,
      },
    });
  } catch (error) {
    res.status(500).json({ msg: "Login failed" });
  }
};

export const logoutStudent = (req, res) => {
  res.clearCookie("token");

  res.status(200).json({
    msg: "Logout success",
  });
};
export const getAllStudent = async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    console.error(error);
    res.json({ msg: "Failed to fetch students" });
  }
};
export const getStudentById = async (req, res) => {
  try {
    const student = await Student.findOne({ _id: req.user.id });
    if (!student) {
      return res.status(404).json({ msg: "Student not found" });
    }
    res.status(200).json({ student });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Failed to fetch student" });
  }
};

export const registerTeacher = async (req, res) => {
  try {
    const { name, email, password, course_id } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ msg: "All fields required" });
    }

    const exists = await Teacher.findOne({ email });

    if (exists) {
      return res.status(400).json({ msg: "Teacher already exists" });
    }

    const teacher = await Teacher.create({
      name,
      email,
      password,
      course_id,
    });

    res.status(201).json(teacher);
  } catch (error) {
    res.status(500).json({ msg: "Teacher registration failed" });
  }
};

export const loginTeacher = async (req, res) => {
  try {
    const { email, password } = req.body;

    const teacher = await Teacher.findOne({ email });
    if (!teacher) return res.status(404).json({ msg: "Teacher not found" });
    if (teacher.password !== password)
      return res.status(401).json({ msg: "Wrong password" });

    // JWT sign
    const token = jwt.sign(
      { id: teacher._id, role: "teacher" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 60 * 60 * 1000,
    });

    res.status(200).json({ msg: "Login success", teacher });
  } catch (err) {
    console.log("Login error:", err);
    res.status(500).json({ msg: "Login failed" });
  }
};

export const getTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ _id: req.user.id });
    if (!teacher) {
      return res.status(404).json({ msg: "Teacher not found" });
    }
    res.status(200).json({ teacher });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Failed to fetch teacher" });
  }
};


export const getTeacherByCourseId = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "Invalid course id" });
    }

    const teacher = await Teacher.findOne({ course_id: id });

    if (!teacher) {
      return res.status(404).json({ msg: "Teacher not found" });
    }

    res.status(200).json({ teacher });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Failed to fetch teacher" });
  }
};