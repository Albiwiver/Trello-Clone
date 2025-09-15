import { io, Socket } from "socket.io-client";
import type { ServerToClientEvents, ClientToServerEvents } from "@/types/ws";

const URL = process.env.NEXT_PUBLIC_WS_URL ?? "http://localhost:3000";


export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(URL, {
  path: "/socket.io",
  transports: ["websocket"],
  autoConnect: true,
  withCredentials: true,
});