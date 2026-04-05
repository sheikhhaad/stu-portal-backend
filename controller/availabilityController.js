import TeacherAvailability from "../model/TeacherAvailability.js";

// Create Slot (Teacher)
export const createAvailability = async (req, res) => {
  try {
    const { teacher_id, date, start_time, end_time } = req.body;

    if (!teacher_id || !date || !start_time || !end_time) {
      return res.status(400).json({ message: "All fields required" });
    }

    const existing = await TeacherAvailability.findOne({
      teacher_id,
      date,
      start_time,
      end_time,
    });

    if (existing)
      return res.status(400).json({ message: "Slot already exists" });

    const slot = await TeacherAvailability.create({
      teacher_id,
      date,
      start_time,
      end_time,
    });

    res.status(201).json(slot);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all slots for a teacher
export const getTeacherAvailability = async (req, res) => {
  try {
    const { teacherId } = req.params;
    const slots = await TeacherAvailability.find({
      teacher_id: teacherId,
    }).sort({
      date: 1,
      start_time: 1,
    });
    res.json(slots);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete slot
export const deleteAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedSlot = await TeacherAvailability.findByIdAndDelete(id);
    res.json(deletedSlot);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
