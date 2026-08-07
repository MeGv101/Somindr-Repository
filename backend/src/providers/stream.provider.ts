import { StreamChat } from "stream-chat";

const apiKey =
  process.env.STREAM_API_KEY!;

const apiSecret =
  process.env.STREAM_API_SECRET!;

const stream =
  StreamChat.getInstance(
    apiKey,
    apiSecret
  );

export function getStreamClient() {
  return stream;
}