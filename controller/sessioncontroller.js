import SessionBooking from "../model/SessionModel.js";
import { createZoomMeeting } from "../utils/zoom.js";
import TeacherAvailability from "../model/TeacherAvailability.js";
import { sendRealtime } from "../utils/realtime.js";

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

    // 🔥 Send realtime updates
    sendRealtime("new_session_request", {
      session,
      slot: slot,
      teacher_id: teacher_id,
      student_id: student_id,
    });

    sendRealtime("slot_update", slot);

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

    // 🔥 Send realtime update
    sendRealtime("update_session_status", {
      session,
      teacher_id: session.teacher_id,
      student_id: session.student_id,
    });

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

// 🔥 New: Delete slot and its associated sessions
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

    // Delete all associated sessions
    if (sessions.length > 0) {
      await SessionBooking.deleteMany({ slot_id: slotId });
      console.log(`Deleted ${sessions.length} sessions for slot ${slotId}`);
    }

    // Delete the slot
    await TeacherAvailability.findByIdAndDelete(slotId);

    // 🔥 Send realtime updates
    sendRealtime("delete_slot", {
      id: slotId,
      teacherId: slot.teacher_id,
      sessions: sessions.map((s) => s._id),
    });

    sendRealtime("slot_deleted_with_sessions", {
      slotId,
      teacherId: slot.teacher_id,
      sessionIds: sessions.map((s) => s._id),
    });

    res.json({
      message: "Slot and associated sessions deleted successfully",
      deletedSessions: sessions.length,
    });
  } catch (error) {
    console.error("Delete slot error:", error);
    res.status(500).json({ message: error.message });
  }
};
