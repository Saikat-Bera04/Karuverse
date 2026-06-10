import { AccessToken } from "livekit-server-sdk";

export const createLivekitRoomName = (title: string) =>
  `karuverse-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}-${Date.now()}`;

export const createLivekitToken = async (input: {
  roomName: string;
  identity: string;
  name: string;
  canPublish?: boolean;
}) => {
  if (!process.env.LIVEKIT_API_KEY || !process.env.LIVEKIT_API_SECRET) {
    throw new Error("LIVEKIT_API_KEY and LIVEKIT_API_SECRET must be configured");
  }

  const at = new AccessToken(
    process.env.LIVEKIT_API_KEY,
    process.env.LIVEKIT_API_SECRET,
    {
      identity: input.identity,
      name: input.name,
      ttl: "2h"
    }
  );

  at.addGrant({
    roomJoin: true,
    room: input.roomName,
    canPublish: input.canPublish ?? true,
    canSubscribe: true,
    canPublishData: true
  });

  return await at.toJwt();
};
