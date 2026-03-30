import Announcement from "../model/Announcement.js";
import { sendRealtime } from "../utils/realtime.js";

// CREATE
export const createAnnouncement = async (req, res) => {
  try {
    const { teacher_id, course_id, text } = req.body;

    const announcement = await Announcement.create({
      teacher_id,
      course_id,
      text,
    });

    // 🔥 realtime
    sendRealtime("new_announcement", announcement);

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

// DELETE
export const deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;

    const announcement = await Announcement.findByIdAndDelete(id);

    // 🔥 realtime
    sendRealtime("delete_announcement", { id });

    res.json(announcement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE
export const updateAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;

    const announcement = await Announcement.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    // 🔥 realtime
    sendRealtime("update_announcement", announcement);

    res.json(announcement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
