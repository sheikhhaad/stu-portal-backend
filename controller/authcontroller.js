import Student from "../model/StudentModel.js";
import sendLoginAlert from "../utils/loginAlert.js";
import Teacher from "../model/TeacherModel.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { uploadBufferToCloudinary } from "../middleware/upload.js";
import { generateOTP } from "../utils/sendOtp.js";
import transporter from "../config/mail.js";

export const registerStudent = async (req, res) => {
  const { rollNumber, password, email, cnic, name } = req.body;

  if (!rollNumber || !password || !email || !cnic || !name) {
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
      name,
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
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  res.status(200).json({ msg: "Logout success" });
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
export const getStudent = async (req, res) => {
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

export const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findOne({ _id: id });
    if (!student) {
      return res.status(404).json({ msg: "Student not found" });
    }
    res.status(200).json({ student });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Failed to fetch student" });
  }
};

export const StudentInfoUpdate = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, phone } = req.body;

    let updateData = { email, phone };

    // ✅ file check properly
    if (req.file) {
      const result = await uploadBufferToCloudinary(
        req.file.buffer,
        "profilePic",
        `student_${id}`, // better unique name
      );

      updateData.profilePic = result.secure_url;
    }

    const student = await Student.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    res.status(200).json({
      success: true,
      student,
    });
  } catch (error) {
    console.error("Update Error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Failed to update student",
    });
  }
};

export const StudentresetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "Email and new password required" });
    }

    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(404).json({ msg: "Student not found" });
    }

    student.password = password;
    await student.save();

    res.status(200).json({ msg: "Password reset successful" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ msg: "Failed to reset password" });
  }
};

export const studentOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const otp = generateOTP();

    global.savedOtp = otp;
    global.expiry = Date.now() + 5 * 60 * 1000;
    let student = await Student.findOne({ email });
    if (!student) {
      return res.status(404).json({ msg: "Student not found" });
    }
    await transporter.sendMail({
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is ${otp}`,
    });

    res.json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error sending OTP" });
  }
};

export const verifyStudentOtp = (req, res) => {
  const { otp } = req.body;

  if (!global.savedOtp || !global.expiry) {
    return res.status(400).json({ message: "No OTP sent" });
  }

  if (Date.now() > global.expiry) {
    return res.status(400).json({ message: "OTP expired" });
  }

  if (String(otp) !== global.savedOtp) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  global.savedOtp = null;
  global.expiry = null;

  res.json({ message: "OTP verified successfully" });
};

export const registerTeacher = async (req, res) => {
  try {
    const { name, email, password } = req.body;

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
    });

    res.status(201).json(teacher);
  } catch (error) {
    res.status(500).json({ msg: "Teacher registration failed" });
  }
};

export const TeacherInfoUpdate = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, phone } = req.body;

    let updateData = { email, phone };

    // ✅ file check properly
    if (req.file) {
      const result = await uploadBufferToCloudinary(
        req.file.buffer,
        "profilePic",
        `teacher_${id}`, // better unique name
      );

      updateData.profilePic = result.secure_url;
    }

    const teacher = await Teacher.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    res.status(200).json({
      success: true,
      teacher,
    });
  } catch (error) {
    console.error("Update Error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Failed to update teacher",
    });
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

export const getTeacherInfo = async (req, res) => {
  try {
    const { teacherId } = req.params;

    if (!teacherId) {
      return res.status(400).json({ msg: "teacherId required" });
    }

    const teacher = await Teacher.findById(teacherId);

    if (!teacher) {
      return res.status(404).json({ msg: "Teacher not found" });
    }

    res.status(200).json({ teacher });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Failed to fetch teacher info" });
  }
};

export const sendOtp = async (req, res) => {
  const { email } = req.body;
  try {
    const otp = generateOTP();

    global.savedOtp = otp;
    global.expiry = Date.now() + 5 * 60 * 1000;
    let teacher = await Teacher.findOne({ email });
    if (!teacher) {
      return res.status(404).json({ msg: "Teacher not found" });
    }
    await transporter.sendMail({
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is ${otp}`,
    });

    res.json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error sending OTP" });
  }
};
export const verifyOtp = (req, res) => {
  const { otp } = req.body;

  if (!global.savedOtp || !global.expiry) {
    return res.status(400).json({ message: "No OTP sent" });
  }

  if (Date.now() > global.expiry) {
    return res.status(400).json({ message: "OTP expired" });
  }

  if (String(otp) !== global.savedOtp) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  global.savedOtp = null;
  global.expiry = null;

  res.json({ message: "OTP verified successfully" });
};

export const resetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "Email and new password required" });
    }

    const teacher = await Teacher.findOne({ email });
    if (!teacher) {
      return res.status(404).json({ msg: "Teacher not found" });
    }

    teacher.password = password;
    await teacher.save();

    res.status(200).json({ msg: "Password reset successful" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ msg: "Failed to reset password" });
  }
};
