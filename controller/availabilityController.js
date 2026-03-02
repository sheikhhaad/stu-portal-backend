// controllers/availabilityController.js

import SessionBooking from "../model/SessionModel.js";
import TeacherAvailability from "../model/TeacherAvailability.js";
import { createZoomMeeting } from "../utils/zoom.js";

// Create Slot (Teacher)
export const createAvailability = async (req, res) => {
  try {
    const { teacher_id, date, start_time, end_time } = req.body;

    if (!teacher_id || !date || !start_time || !end_time) {
      return res.status(400).json({ message: "All fields required" });
    }

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

export const getTeacherAvailability = async (req, res) => {
  try {
    const { teacherId } = req.params;

    const slots = await TeacherAvailability.find({
      teacher_id: teacherId,
    });

    res.json(slots);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const bookSlot = async (req, res) => {
  try {
    const { slotId } = req.params;
    const { student_id, teacher_id, duration, requested_time } = req.body;

    const updatedSlot = await TeacherAvailability.findOneAndUpdate(
      { _id: slotId, is_booked: false },
      { is_booked: true },
      { returnDocument: "after" },
    );

    if (!updatedSlot) {
      return res.status(400).json({ message: "Slot already booked" });
    }

    const sessionStart = new Date(
      requested_time ||
        `${updatedSlot.date}T${updatedSlot.start_time}:00+05:00`,
    );

    const sessionEnd = new Date(
      sessionStart.getTime() + (duration || 30) * 60000,
    );

    const meeting = await createZoomMeeting("Student Session", duration || 30);

    const session = await SessionBooking.create({
      student_id,
      teacher_id,
      slot_id: slotId,
      duration,
      requested_time: sessionStart.toISOString(),
      session_start: sessionStart.toISOString(),
      session_end: sessionEnd.toISOString(),
      status: "pending",
      meeting_link: meeting.join_url,
      meeting_id: meeting.id,
    });

    res.json({
      message: "Slot booked successfully",
      slot: updatedSlot,
      session,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSessionBySlotId = async (req, res) => {
  try {
    const { slotId } = req.params;
    console.log(req.params);

    const session = await SessionBooking.findOne({
      slot_id: slotId,
    });

    res.json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getSessionByStudentSlotId = async (req, res) => {
  try {
    const { studentId } = req.params;
    console.log(studentId);
    const session = await SessionBooking.find({
      student_id: studentId,
    });
    console.log(session);
    res.json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getallSession = async (req, res) => {
  try {
    const session = await SessionBooking.find();
    res.json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// export const bookSlot = async (req, res) => {
//   try {
//     const { slotId } = req.params;
//     const { student_id, teacher_id, duration, requested_time } = req.body;

//     const updatedSlot = await TeacherAvailability.findOneAndUpdate(
//       { _id: slotId, is_booked: false },
//       { is_booked: true },
//       { returnDocument: "after" },
//     );

//     if (!updatedSlot) {
//       return res.status(400).json({ message: "Slot already booked" });
//     }

//     let validRequestedTime = requested_time;

//     if (
//       validRequestedTime &&
//       typeof validRequestedTime === "string" &&
//       !validRequestedTime.includes("Z") &&
//       !validRequestedTime.includes("+")
//     ) {
//       if (validRequestedTime.length === 16) {
//         validRequestedTime += ":00+05:00";
//       } else if (validRequestedTime.length === 19) {
//         validRequestedTime += "+05:00";
//       }
//     }

//     if (!validRequestedTime || isNaN(new Date(validRequestedTime).getTime())) {
//       validRequestedTime = `${updatedSlot.date}T${updatedSlot.start_time}:00+05:00`;
//     }

//     const sessionStart = new Date(validRequestedTime);
//     const sessionEnd = new Date(sessionStart.getTime() + duration * 60000);

//     const session = await SessionBooking.create({
//       student_id,
//       teacher_id,
//       duration,
//       requested_time: sessionStart.toISOString(),
//       session_start: sessionStart.toISOString(),
//       session_end: sessionEnd.toISOString(),
//       status: "pending",
//     });

//     res.json({ slot: updatedSlot, session });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
