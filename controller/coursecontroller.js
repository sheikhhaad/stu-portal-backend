import Course from "../model/CourseModel.js";

// Create
export const createCourse = async (req, res) => {
  try {
    const { name, code, days, time, description } = req.body;

    if (!name || !code || !days || !time || !description) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const newCourse = await Course.create({
      name,
      code,
      days,
      time,
      description,
    });

    res.status(201).json({ course: newCourse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Failed to create course" });
  }
};

// Get All
export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json({ courses });
  } catch (error) {
    res.status(500).json({ msg: "Failed to fetch courses" });
  }
};

// Get Single
export const getSingleCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ msg: "Course not found" });
    }

    res.status(200).json({ course });
  } catch (error) {
    res.status(500).json({ msg: "Error fetching course" });
  }
};

// Update
export const updateCourse = async (req, res) => {
  try {
    const updated = await Course.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: "after",
    });

    if (!updated) {
      return res.status(404).json({ msg: "Course not found" });
    }

    res.status(200).json({ course: updated });
  } catch (error) {
    res.status(500).json({ msg: "Failed to update course" });
  }
};

// Delete
export const deleteCourse = async (req, res) => {
  try {
    const deleted = await Course.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ msg: "Course not found" });
    }

    res.status(200).json({ msg: "Course deleted" });
  } catch (error) {
    res.status(500).json({ msg: "Failed to delete course" });
  }
};
