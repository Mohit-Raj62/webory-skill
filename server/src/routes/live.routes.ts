import { Router } from "express";
import { createToken, closeRoom } from "../services/livekit.service";
import LiveSession from "../../../src/models/LiveSession";

const router = Router();

// Endpoint for students/teachers to get a LiveKit token
router.post("/token", async (req, res) => {
  try {
    const { roomId, participantName, isInstructor } = req.body;
    
    if (!roomId || !participantName) {
      return res.status(400).json({ error: "Missing roomId or participantName" });
    }
    console.log(`Generating token for Room: ${roomId}, Participant: ${participantName}, isInstructor: ${isInstructor}`);

    const token = await createToken(roomId, participantName, isInstructor);
    res.json({ token });
  } catch (error) {
    console.error("Error generating LiveKit token:", error);
    res.status(500).json({ error: "Failed to generate token" });
  }
});

// Endpoint to start a live class
router.post("/create", async (req, res) => {
  try {
    const { 
      title, 
      description, 
      instructorId, 
      courseId, 
      sessionType = "general", 
      internshipId, 
      applicationId, 
      moduleId 
    } = req.body;
    
    const roomId = `room-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const session = new LiveSession({
      title,
      description,
      instructor: instructorId,
      sessionType,
      courseId,
      internshipId,
      applicationId,
      moduleId,
      roomId,
      status: "active",
      scheduledAt: new Date(),
      startedAt: new Date(),
    });

    await session.save();
    res.status(201).json(session);
  } catch (error) {
    console.error("Error starting live class:", error);
    res.status(500).json({ error: "Failed to start live class", details: error instanceof Error ? error.message : String(error) });
  }
});

// Endpoint to end a live class
router.post("/end", async (req, res) => {
  try {
    const { sessionId } = req.body;
    const session = await LiveSession.findById(sessionId);
    
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    session.status = "ended";
    session.endedAt = new Date();
    await session.save();

    await closeRoom(session.roomId);
    
    res.json({ message: "Session ended successfully" });
  } catch (error) {
    console.error("Error ending live class:", error);
    res.status(500).json({ error: "Failed to end live class" });
  }
});

export default router;
