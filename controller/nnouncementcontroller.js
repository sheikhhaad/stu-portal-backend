import Announcement from "../model/Announcement.js";

export const createAnnouncement = async (req, res) => {
  try {
    const { teacher_id, course_id, text } = req.body;
    const announcement = await Announcement.create({
      teacher_id,
      course_id,
      text,
    });
    res.json(announcement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find();
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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
