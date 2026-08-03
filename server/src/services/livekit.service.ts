import { AccessToken, RoomServiceClient } from "livekit-server-sdk";
import dotenv from "dotenv";

dotenv.config({ path: "../.env.local" });

const LIVEKIT_API_KEY = process.env.LIVEKIT_API_KEY || "devkey";
const LIVEKIT_API_SECRET = process.env.LIVEKIT_API_SECRET || "secret";
const LIVEKIT_URL = process.env.NEXT_PUBLIC_LIVEKIT_URL || process.env.LIVEKIT_URL || "ws://localhost:7880";

const roomService = new RoomServiceClient(LIVEKIT_URL, LIVEKIT_API_KEY, LIVEKIT_API_SECRET);

export const createToken = async (roomName: string, participantName: string, isInstructor = false) => {
  const at = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, {
    identity: participantName,
    name: participantName,
  });

  at.addGrant({
    roomJoin: true,
    room: roomName,
    canPublish: isInstructor,
    canSubscribe: true,
    canPublishData: true,
  });

  return await at.toJwt();
};

export const closeRoom = async (roomName: string) => {
  try {
    await roomService.deleteRoom(roomName);
    console.log(`Deleted room ${roomName}`);
  } catch (error) {
    console.error("Error closing LiveKit room", error);
  }
};
