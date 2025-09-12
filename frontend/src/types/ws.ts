import type { Column } from "@/types/column";
import type { Card } from "@/types/card";

export type JoinLeavePayload = { boardId: string };


export interface ServerToClientEvents {
  "column.created": (payload: { boardId: string; column: Column }) => void;
  "column.updated": (payload: { boardId: string; column: Column }) => void;
  "column.deleted": (payload: { boardId: string; columnId: string }) => void;

  "card.created":   (payload: { boardId: string; card: Card }) => void;
  "card.updated":   (payload: { boardId: string; card: Card }) => void;
  "card.deleted":   (payload: { boardId: string; columnId: string; cardId: string }) => void;
  "card.moved":     (payload: {
    boardId: string;
    cardId: string;
    fromColumnId: string;
    toColumnId: string;
    toOrder: number;
  }) => void;
}


export interface ClientToServerEvents {
  joinBoard:  (p: JoinLeavePayload) => void;
  leaveBoard: (p: JoinLeavePayload) => void;
}
