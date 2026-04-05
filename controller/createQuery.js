// controllers/queryController.js
import Query from "../model/Query.js";
import { getIO } from "../utils/socket.js"; // ✅ import socket.io instance

// CREATE query
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

    const io = getIO();
    io.emit("new_query", newQuery);

    res.status(201).json(newQuery);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Failed to create query" });
  }
};

// GET all queries
export const getAllQueries = async (req, res) => {
  try {
    const queries = await Query.find();
    res.status(200).json({ queries });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Failed to fetch queries" });
  }
};

// GET queries by student & course
export const getStudentCourseQueries = async (req, res) => {
  try {
    const { studentId, courseId } = req.params;
    const queries = await Query.find({
      student_id: studentId,
      course_id: courseId,
    });
    res.json(queries);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// GET queries by teacher & course
export const getTeacherCourseQueries = async (req, res) => {
  try {
    const { teacherId, courseId } = req.params;
    const queries = await Query.find({
      teacher_id: teacherId,
      course_id: courseId,
    });
    res.json(queries);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// UPDATE query (answer/status)
export const updateQuery = async (req, res) => {
  try {
    const { id } = req.params;
    const { answer, status } = req.body;

    if (!id) {
      return res.status(400).json({ msg: "Query ID is required" });
    }

    const updatedQuery = await Query.findByIdAndUpdate(
      id,
      { answer, status },
      { new: true }, // ✅ corrected option
    );

    if (!updatedQuery) {
      return res.status(404).json({ msg: "Query not found" });
    }

    const io = getIO();
    io.emit("update_query", updatedQuery);
    res.json(updatedQuery);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// DELETE query
export const deleteQuery = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Query.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ msg: "Query not found" });
    }

    const io = getIO();
    io.emit("delete_query", { id });
    res.json({ msg: "Query deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
