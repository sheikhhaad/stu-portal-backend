import Announcement from "../model/Announcement.js";
import { getIO } from "../utils/socket.js";

// CREATE
export const createAnnouncement = async (req, res) => {
  try {
    const { teacher_id, course_id, text } = req.body;

    const announcement = await Announcement.create({
      teacher_id,
      course_id,
      text,
    });
    const io = getIO();
    io.emit("new_announcement", announcement);
    res.json(announcement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL
export const getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find();
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET TEACHER
export const getTeacherAnnouncements = async (req, res) => {
  try {
    const { teacherId, courseId } = req.params;
    const announcements = await Announcement.find({
      teacher_id: teacherId,
      course_id: courseId,
    });
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE (with real-time emit)
export const deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const announcement = await Announcement.findByIdAndDelete(id);
    if (!announcement) {
      return res.status(404).json({ message: "Announcement not found" });
    }
    const io = getIO();
    io.emit("delete_announcement", { id }); // emit the id so frontend can remove it
    res.json(announcement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE (with real-time emit)
export const updateAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const announcement = await Announcement.findByIdAndUpdate(id, req.body, {
      returnDocument: "after",
    });
    if (!announcement) {
      return res.status(404).json({ message: "Announcement not found" });
    }
    const io = getIO();
    io.emit("update_announcement", announcement); // send full updated object
    res.json(announcement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};