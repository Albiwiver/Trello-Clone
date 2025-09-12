// src/hooks/useBoardSocket.ts
import { useEffect } from "react";
import { socket } from "@/lib/socket";
import { useColumnsStore } from "@/store/columnStore";
import { useCardsStore } from "@/store/cardsStore";
import type { ServerToClientEvents } from "@/types/ws";


type ColCreated  = Parameters<ServerToClientEvents["column.created"]>[0];
type ColUpdated  = Parameters<ServerToClientEvents["column.updated"]>[0];
type ColDeleted  = Parameters<ServerToClientEvents["column.deleted"]>[0];
type CardCreated = Parameters<ServerToClientEvents["card.created"]>[0];
type CardUpdated = Parameters<ServerToClientEvents["card.updated"]>[0];
type CardDeleted = Parameters<ServerToClientEvents["card.deleted"]>[0];
type CardMoved   = Parameters<ServerToClientEvents["card.moved"]>[0];

export function useBoardSocket(boardId: string) {
  const addCol = useColumnsStore(s => s.add);
  const updCol = useColumnsStore(s => s.update);
  const delCol = useColumnsStore(s => s.remove);

  const addCard  = useCardsStore(s => s.add);
  const updCard  = useCardsStore(s => s.update);
  const delCard  = useCardsStore(s => s.remove);
  const moveCard = useCardsStore(s => s.applyMove);

  useEffect(() => {
    if (!boardId) return;

    socket.emit("joinBoard", { boardId });

   
    const onColCreated = (p: ColCreated) => {
      if (p.boardId === boardId) addCol(p.column);
    };
    const onColUpdated = (p: ColUpdated) => {
      if (p.boardId === boardId) updCol(p.column);
    };
    const onColDeleted = (p: ColDeleted) => {
      if (p.boardId === boardId) delCol(p.columnId);
    };

    const onCardCreated = (p: CardCreated) => {
      if (p.boardId === boardId) addCard(p.card);
    };
    const onCardUpdated = (p: CardUpdated) => {
      if (p.boardId === boardId) updCard(p.card);
    };
    const onCardDeleted = (p: CardDeleted) => {
      if (p.boardId === boardId) delCard(p.columnId, p.cardId);
    };
    const onCardMoved = (p: CardMoved) => {
      if (p.boardId === boardId)
        moveCard({
          cardId: p.cardId,
          fromColumnId: p.fromColumnId,
          toColumnId: p.toColumnId,
          toOrder: p.toOrder,
        });
    };

    socket.on("column.created", onColCreated);
    socket.on("column.updated", onColUpdated);
    socket.on("column.deleted", onColDeleted);
    socket.on("card.created",   onCardCreated);
    socket.on("card.updated",   onCardUpdated);
    socket.on("card.deleted",   onCardDeleted);
    socket.on("card.moved",     onCardMoved);

    return () => {
      socket.emit("leaveBoard", { boardId });
      socket.off("column.created", onColCreated);
      socket.off("column.updated", onColUpdated);
      socket.off("column.deleted", onColDeleted);
      socket.off("card.created",   onCardCreated);
      socket.off("card.updated",   onCardUpdated);
      socket.off("card.deleted",   onCardDeleted);
      socket.off("card.moved",     onCardMoved);
    };
  }, [boardId, addCol, updCol, delCol, addCard, updCard, delCard, moveCard]);
}
