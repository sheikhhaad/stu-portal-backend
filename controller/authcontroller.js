import Student from "../model/StudentModel.js";
import sendLoginAlert from "../utils/loginAlert.js";
import Teacher from "../model/TeacherModel.js";

export const registerStudent = async (req, res) => {
  let { rollNumber, password, email, cnic } = req.body;
  if (!rollNumber || !password || !email || !cnic) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }

  try {
    let student = await Student.findOne({ rollNumber });
    if (student) {
      return res.status(400).json({ msg: "Student already exists" });
    }
    student = new Student({ rollNumber, password, email, cnic });
    await student.save();
    res.json({ msg: "Student registered successfully", status: 200 });
  } catch (error) {
    console.error("Error registering student:", error);
    res.json({ msg: "Registration failed (Alert failed)", status: 500 });
  }
};

export const loginStudent = async (req, res) => {
  const { rollNumber, password } = req.body;

  if (!rollNumber) {
    return res.status(400).json({ msg: "rollNumber required" });
  }

  try {
    const student = await Student.findOne({ rollNumber });

    if (!student) {
      return res.status(404).json({ msg: "Student not found" });
    }

    // QR login (no password sent)
    if (!password) {
      await sendLoginAlert(req, student.email);

      // Set cookie (id for session)
      res.cookie("studentAuth", student._id, {
        httpOnly: true,
        maxAge: 60 * 60 * 1000,
        sameSite: "strict",
      });

      return res.status(200).json({
        msg: "QR login success",
        student: {
          rollNumber: student.rollNumber,
          email: student.email,
          cnic: student.cnic,
          _id: student._id,
        },
      });
    }

    // Normal login
    if (password !== student.password) {
      return res.status(401).json({ msg: "Wrong password" });
    }

    await sendLoginAlert(req, student.email);

    // Set cookie
    res.cookie("studentAuth", student._id, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000,
      sameSite: "strict",
    });

    return res.status(200).json({
      msg: "Login success",
      student: {
        rollNumber: student.rollNumber,
        email: student.email,
        cnic: student.cnic,
        _id: student._id,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Login failed" });
  }
};
export const logoutStudent = async (req, res) => {
  res.clearCookie("studentAuth");
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
    const student = await Student.findOne({ rollNumber: req.params.id }); // use the custom ID field
    if (!student) {
      return res.status(404).json({ msg: "Student not found" });
    }
    res.status(200).json({ student });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Failed to fetch student" });
  }
};

// for teacher

// Teacher register
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

    if (!teacher) {
      return res.status(404).json({ msg: "Teacher not found" });
    }

    if (teacher.password !== password) {
      return res.status(401).json({ msg: "Invalid password" });
    }

    res.cookie("teacherAuth", teacher._id, {
      httpOnly: true,
      sameSite: "lax",
    });

    res.status(200).json({
      msg: "Login success",
      teacher,
    });
  } catch (error) {
    res.status(500).json({ msg: "Login failed" });
  }
};

export const getTeacherByCourseId = async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ course_id: req.params.id });
    if (!teacher) {
      return res.status(404).json({ msg: "Teacher not found" });
    }
    res.status(200).json({ teacher });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Failed to fetch teacher" });
  }
};
