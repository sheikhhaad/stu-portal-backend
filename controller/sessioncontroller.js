import SessionBooking from "../model/SessionModel.js";
import { createZoomMeeting } from "../utils/zoom.js";
import TeacherAvailability from "../model/TeacherAvailability.js";
import { getTeacherAvailability } from "./availabilityController.js";

export const bookSlot = async (req, res) => {
  try {
    const { slotId } = req.params;
    const { student_id, teacher_id, duration, requested_time } = req.body;

    const slot = await TeacherAvailability.findById(slotId);

    if (!slot) {
      return res.status(404).json({ message: "Slot not found" });
    }

    const sessionStart = new Date(requested_time);
    const sessionEnd = new Date(
      sessionStart.getTime() + (duration || 15) * 60000,
    );

    const conflict = await SessionBooking.findOne({
      teacher_id,
      status: "accepted",
      $and: [
        { session_start: { $lt: sessionEnd.toISOString() } },
        { session_end: { $gt: sessionStart.toISOString() } },
      ],
    });
    if (conflict) {
      return res.status(400).json({
        message: "Time already booked",
      });
    }

    // Prevent duplicate pending request by same student
    const existingRequest = await SessionBooking.findOne({
      student_id,
      teacher_id,
      session_start: sessionStart.toISOString(),
      status: "pending",
    });

    if (existingRequest) {
      return res.status(400).json({
        message: "Request already sent",
      });
    }

    const session = await SessionBooking.create({
      student_id,
      teacher_id,
      slot_id: slotId,
      duration: duration || 15,
      requested_time: sessionStart.toISOString(),
      session_start: sessionStart.toISOString(),
      session_end: sessionEnd.toISOString(),
      status: "pending",
    });

    res.json({
      message: "Request sent",
      session,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getSessionBySlotId = async (req, res) => {
  try {
    const { slotId } = req.params;

    const sessions = await SessionBooking.find({
      slot_id: slotId,
    });

    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSessionByStudentSlotId = async (req, res) => {
  try {
    const { studentId } = req.params;
    const session = await SessionBooking.find({
      student_id: studentId,
    });
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

export const getTeacherSession = async (req, res) => {
  try {
    const { teacherId } = req.params;
    const session = await SessionBooking.find({
      teacher_id: teacherId,
    });
    res.json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateSessionStatus = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await SessionBooking.findById(sessionId);

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    // check accepted session same time
    const conflict = await SessionBooking.findOne({
      teacher_id: session.teacher_id,
      session_start: session.session_start,
      status: "accepted",
    });

    if (conflict) {
      return res.status(400).json({
        message: "Time already booked",
      });
    }

    const meeting = await createZoomMeeting(
      "Student Session",
      session.duration,
    );

    session.status = "accepted";
    session.meeting_link = meeting.join_url;
    session.meeting_id = meeting.id;

    await session.save();

    res.json(session);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Time already booked",
      });
    }

    res.status(500).json({ message: error.message });
  }
};
