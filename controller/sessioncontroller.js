import SessionBooking from "../model/SessionModel.js";
import { getIO } from "../utils/socket.js";
import TeacherAvailability from "../model/TeacherAvailability.js";

// ✅ JITSI HELPER
const createJitsiMeeting = (sessionId, duration = 15) => {
  const roomName = `session-${sessionId}-${Date.now()}`;

  return {
    roomName,
    meeting_link: `https://meet.jit.si/${roomName}`,
    duration,
  };
};

// ✅ BOOK SLOT
export const bookSlot = async (req, res) => {
  try {
    const { slotId } = req.params;
    const { student_id, teacher_id, duration, requested_time } = req.body;

    const slot = await TeacherAvailability.findById(slotId);

    if (!slot) {
      return res.status(404).json({ message: "Slot not found" });
    }

    if (slot.is_booked) {
      return res.status(400).json({ message: "Slot is already booked" });
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

    slot.is_booked = true;
    slot.booked_by = student_id;
    slot.booked_at = new Date();
    await slot.save();

    const io = getIO();
    io.emit("session_booked", session);

    res.json({
      message: "Request sent successfully",
      session,
      slot,
    });
  } catch (error) {
    console.error("Booking error:", error);
    res.status(500).json({
      message: error.message,
    });
  }
};

// ✅ GET SESSIONS
export const getSessionByStudentSlotId = async (req, res) => {
  try {
    const { studentId } = req.params;
    const sessions = await SessionBooking.find({ student_id: studentId });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSessionById = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await SessionBooking.findById(sessionId);
    res.json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getallSession = async (req, res) => {
  try {
    const sessions = await SessionBooking.find();
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTeacherSession = async (req, res) => {
  try {
    const { teacherId } = req.params;
    const sessions = await SessionBooking.find({ teacher_id: teacherId });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ ACCEPT / REJECT SESSION
export const updateSessionStatus = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { status } = req.body;

    const session = await SessionBooking.findById(sessionId);

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    if (status === "accepted") {
      const conflict = await SessionBooking.findOne({
        teacher_id: session.teacher_id,
        session_start: session.session_start,
        status: "accepted",
        _id: { $ne: sessionId },
      });

      if (conflict) {
        return res.status(400).json({
          message: "Time already booked by another session",
        });
      }

      // ✅ JITSI MEETING CREATE
      const meeting = createJitsiMeeting(session._id, session.duration);

      session.status = "accepted";
      session.meeting_link = meeting.meeting_link;
      session.roomName = meeting.roomName;
      session.accepted_at = new Date();
    } else {
      session.status = status;
    }

    await session.save();

    const io = getIO();
    io.emit("session_updated", session);

    res.json(session);
  } catch (error) {
    console.error("Update session error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ DELETE SESSION + SLOT
export const deleteSessions = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const slot = await TeacherAvailability.findById(sessionId);
    if (!slot) {
      return res.status(404).json({ message: "Slot not found" });
    }

    const sessions = await SessionBooking.find({ slot_id: sessionId });

    if (sessions.length > 0) {
      await SessionBooking.deleteMany({ slot_id: sessionId });
    }

    await TeacherAvailability.findByIdAndDelete(sessionId);

    const io = getIO();

    sessions.forEach((s) => {
      io.emit("session_deleted", { id: s._id });
    });

    io.emit("slot_deleted", { slotId: sessionId });

    res.json({
      message: "Deleted successfully",
      deletedSessions: sessions.length,
    });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: error.message });
  }
};
