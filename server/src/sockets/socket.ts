import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
import LiveChat from "../../../src/models/LiveChat";
import LiveAttendance from "../../../src/models/LiveAttendance";
import mongoose from "mongoose";

let io: Server;

export const initSocket = (server: HttpServer) => {
  io = new Server(server, {
    cors: {
      origin: "*", // allow all in dev, configure in prod
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket: Socket) => {
    console.log("Client connected:", socket.id);

    // Join a live session room
    socket.on("join-room", async (data: { roomId: string; studentName: string; studentId?: string; isGuest?: boolean; liveSessionId: string }) => {
      const { roomId, studentName, studentId, isGuest, liveSessionId } = data;
      socket.join(roomId);
      console.log(`${studentName} joined room ${roomId}`);

      // Save Attendance
      if (liveSessionId) {
        try {
          const attendance = new LiveAttendance({
            liveSessionId: new mongoose.Types.ObjectId(liveSessionId),
            studentId: studentId ? new mongoose.Types.ObjectId(studentId) : undefined,
            studentName,
            isGuest: isGuest ?? true,
            joinTime: new Date(),
          });
          await attendance.save();
          socket.data.attendanceId = attendance._id;
        } catch (error) {
          console.error("Error saving attendance:", error);
        }
      }

      // Notify others in room
      socket.to(roomId).emit("user-joined", { studentName, id: socket.id });
    });

    // Handle Chat Messages
    socket.on("send-message", async (data: { roomId: string; message: string; senderName: string; senderId?: string; isInstructor?: boolean; liveSessionId: string }) => {
      const { roomId, message, senderName, senderId, isInstructor, liveSessionId } = data;
      
      try {
        const chat = new LiveChat({
          liveSessionId: new mongoose.Types.ObjectId(liveSessionId),
          senderId: senderId ? new mongoose.Types.ObjectId(senderId) : undefined,
          senderName,
          isInstructor: isInstructor || false,
          message,
          timestamp: new Date(),
        });
        await chat.save();
        
        io.to(roomId).emit("receive-message", chat);
      } catch (error) {
        console.error("Error saving chat:", error);
      }
    });

    // Handle Disconnect
    socket.on("disconnect", async () => {
      console.log("Client disconnected:", socket.id);
      if (socket.data.attendanceId) {
        try {
          const attendance = await LiveAttendance.findById(socket.data.attendanceId);
          if (attendance) {
            attendance.leaveTime = new Date();
            attendance.duration = Math.floor((attendance.leaveTime.getTime() - attendance.joinTime.getTime()) / 1000);
            await attendance.save();
          }
        } catch (error) {
          console.error("Error updating attendance:", error);
        }
      }
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};
