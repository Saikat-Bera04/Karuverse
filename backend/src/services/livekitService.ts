import jwt from "jsonwebtoken";

export const createLivekitRoomName = (title: string) =>
  `karuverse-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}-${Date.now()}`;

export const createLivekitToken = (input: {
  roomName: string;
  identity: string;
  name: string;
  canPublish?: boolean;
}) => {
  if (!process.env.LIVEKIT_API_KEY || !process.env.LIVEKIT_API_SECRET) {
    throw new Error("LIVEKIT_API_KEY and LIVEKIT_API_SECRET must be configured");
  }

  return jwt.sign(
    {
      iss: process.env.LIVEKIT_API_KEY,
      sub: input.identity,
      name: input.name,
      video: {
        room: input.roomName,
        roomJoin: true,
        canPublish: input.canPublish ?? true,
        canSubscribe: true
      }
    },
    process.env.LIVEKIT_API_SECRET,
    { expiresIn: "2h" }
  );
};
