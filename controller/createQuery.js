import Query from "../model/Query.js";

export const createQuery = async (req, res) => {
  try {
    const { student_id, teacher_id, course, query, course_id } = req.body;

    if (!student_id || !teacher_id || !query || !course_id) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const newQuery = await Query.create({
      student_id,
      teacher_id,
      course,
      query,
      course_id,
    });

    res.status(201).json(newQuery);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Failed to create query" });
  }
};

export const getAllQueries = async (req, res) => {
  try {
    const queries = await Query.find();
    res.status(200).json({ queries });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Failed to fetch queries" });
  }
};

export const getStudentCourseQueries = async (req, res) => {
  try {
    const { studentId, courseId } = req.params;

    const queries = await Query.find({
      student_id: studentId,
      course_id: courseId,
    });

    res.json(queries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateQuery = async (req, res) => {
  try {
    const { id } = req.params;
    const { answer, status } = req.body;

    const updatedQuery = await Query.findByIdAndUpdate(
      id,
      { answer, status },
      { new: true },
    );

    res.json(updatedQuery);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
