import SessionBooking from "../model/SessionModel.js";
import { createZoomMeeting } from "../utils/zoom.js";
import TeacherAvailability from "../model/TeacherAvailability.js";
import { getIO } from "../utils/socket.js"; // ✅ import socket instance

export const bookSlot = async (req, res) => {
  try {
    const { slotId } = req.params;
    const { student_id, teacher_id, duration, requested_time } = req.body;

    const slot = await TeacherAvailability.findById(slotId);

    if (!slot) {
      return res.status(404).json({ message: "Slot not found" });
    }

    // Check if slot is already booked
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

    // 🔥 Mark slot as booked
    slot.is_booked = true;
    slot.booked_by = student_id;
    slot.booked_at = new Date();
    await slot.save();

    const io = getIO();
    // Emit to teacher (and student) that a new session request has been created
    io.emit("session_booked", session);
    // Optionally emit to a specific room (e.g., teacher room) for better efficiency
    // io.to(`teacher_${teacher_id}`).emit("session_booked", session);

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

export const getSessionBySlotId = async (req, res) => {
  try {
    const { slotId } = req.params;
    const sessions = await SessionBooking.find({ slot_id: slotId });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSessionByStudentSlotId = async (req, res) => {
  try {
    const { studentId } = req.params;
    const sessions = await SessionBooking.find({ student_id: studentId });
    res.json(sessions);
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

export const updateSessionStatus = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { status } = req.body;

    const session = await SessionBooking.findById(sessionId);

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    if (status === "accepted") {
      // Check for conflicts with accepted sessions
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

      // Create Zoom meeting
      const meeting = await createZoomMeeting(
        `Student Session - ${session.student_id}`,
        session.duration,
      );

      session.status = "accepted";
      session.meeting_link = meeting.join_url;
      session.meeting_id = meeting.id;
      session.accepted_at = new Date();
    } else {
      session.status = status;
    }

    await session.save();

    const io = getIO();
    // Emit the updated session to both student and teacher
    io.emit("session_updated", session);
    // Optional: emit to specific room
    // io.to(`student_${session.student_id}`).emit("session_updated", session);
    // io.to(`teacher_${session.teacher_id}`).emit("session_updated", session);

    res.json(session);
  } catch (error) {
    console.error("Update session error:", error);
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Time already booked",
      });
    }
    res.status(500).json({ message: error.message });
  }
};

// Delete slot and its associated sessions (with real-time emit)
export const deleteSlotAndSessions = async (req, res) => {
  try {
    const { slotId } = req.params;

    // Find the slot
    const slot = await TeacherAvailability.findById(slotId);
    if (!slot) {
      return res.status(404).json({ message: "Slot not found" });
    }

    // Find all sessions for this slot
    const sessions = await SessionBooking.find({ slot_id: slotId });

    // Delete all associated  sessions
    if (sessions.length > 0) {
      await SessionBooking.deleteMany({ slot_id: slotId });
      console.log(`Deleted ${sessions.length} sessions for slot ${slotId}`);
    }

    // Delete the slot
    await TeacherAvailability.findByIdAndDelete(slotId);

    const io = getIO();
    for (const session of sessions) {
      io.emit("session_deleted", { id: session._id });
    }
    io.emit("slot_deleted", { slotId });

    res.json({
      message: "Slot and associated sessions deleted successfully",
      deletedSessions: sessions.length,
    });
  } catch (error) {
    console.error("Delete slot error:", error);
    res.status(500).json({ message: error.message });
  }
};