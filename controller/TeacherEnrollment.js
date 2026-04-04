import TeacherEnrollment from "../model/TeacherEnrollment.js";
import { sendRealtime } from "../utils/realtime.js";

export const createTeacherEnrollment = async (req, res) => {
  try {
    const { teacher_id, course_id } = req.body;
    if (!teacher_id || !course_id) {
      return res.status(400).json({ msg: "Teacher and course required" });
    }
    const newTeacherEnrollment = await TeacherEnrollment.create({
      teacher_id,
      course_id,
    });
    
    // 🔥 realtime
    sendRealtime("new_teacher_enrollment", newTeacherEnrollment);

    res.status(201).json({ teacherEnrollment: newTeacherEnrollment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Failed to create teacher enrollment" });
  }
};

export const getTeacherEnrollments = async (req, res) => {
  try {
    const { courseId } = req.params;

    if (!courseId) {
      return res.status(400).json({ msg: "courseId required" });
    }

    const teacherEnrollments = await TeacherEnrollment.find({
      course_id: courseId,
    });
    // .populate("teacher_id");

    res.status(200).json({ teacherEnrollments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Failed to fetch teacher enrollments" });
  }
};


export const getAllTeacherEnrollments = async (req, res) => {
  try {
    const teacherEnrollments = await TeacherEnrollment.find();
    res.status(200).json({ teacherEnrollments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Failed to fetch teacher enrollments" });
  }
};


export const getTeacherById = async (req, res) => {
  try {
    const { teacherId } = req.params;

    if (!teacherId) {
      return res.status(400).json({ msg: "teacherId required" });
    }

    const teacherEnrollments = await TeacherEnrollment.find({
      teacher_id: teacherId,
    });
    // .populate("teacher_id");

    res.status(200).json({ teacherEnrollments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Failed to fetch teacher enrollments" });
  }
};