import Enrollment from "../model/enrollnmentModel.js";
import { sendRealtime } from "../utils/realtime.js";

// Create new enrollment
export const createEnrollment = async (req, res) => {
  try {
    const { student_id, course_id } = req.body;

    if (!student_id || !course_id) {
      return res.status(400).json({ msg: "Student and course required" });
    }

    const newEnrollment = await Enrollment.create({ student_id, course_id });
    
    // 🔥 realtime
    sendRealtime("new_enrollment", newEnrollment);

    res.status(201).json({ enrollment: newEnrollment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Failed to create enrollment" });
  }
};

// Get all courses for a student
export const getStudentEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({
      student_id: req.params.studentId,
    }).populate("course_id"); // fetch full course object

    const courses = enrollments.map((e) => e.course_id);
    res.status(200).json({ courses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Failed to fetch student enrollments" });
  }
};

// Get all students in a course
export const getCourseEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({
      course_id: req.params.courseId,
    }).populate("student_id"); // fetch full student object

    const students = enrollments.map((e) => e.student_id);
    res.status(200).json({ students });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Failed to fetch course enrollments" });
  }
};

// Delete an enrollment
export const deleteEnrollment = async (req, res) => {
  try {
    const deleted = await Enrollment.findByIdAndDelete(req.params.id);

    if (!deleted) return res.status(404).json({ msg: "Enrollment not found" });

    // 🔥 realtime
    sendRealtime("delete_enrollment", { id: req.params.id });

    res.status(200).json({ msg: "Enrollment deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Failed to delete enrollment" });
  }
};
