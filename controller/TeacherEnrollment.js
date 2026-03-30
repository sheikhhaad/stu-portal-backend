import TeacherEnrollment from "../model/TeacherEnrollment.js";

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
