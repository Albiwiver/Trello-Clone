// src/app/board/[id]/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import type { DropResult } from "@hello-pangea/dnd";

import { boardService } from "@/services/boardService";
import { cardService } from "@/services/cardService";

import type { Column } from "@/types/column";
import type { Card } from "@/types/card";

import { useColumnsStore } from "@/store/columnStore";
import { useCardsStore } from "@/store/cardsStore";
import { useBoardSocket } from "@/hooks/useBoardSocket";


import BoardHeader from "./BoardHeader";
import ColumnsScroller from "./CollumnScroller";
import BoardModals from "./BoardModals";


const EMPTY_COLS: Column[] = [];

export default function BoardPage() {
  const { id: boardId } = useParams<{ id: string }>();

  
  const [meta, setMeta] = useState<{ id: string; title: string } | null>(null);

  
  const hydrateCols   = useColumnsStore((s) => s.hydrate);
  const addColStore   = useColumnsStore((s) => s.add);
  const updColStore   = useColumnsStore((s) => s.update);
  const delColStore   = useColumnsStore((s) => s.remove);

  const hydrateCards  = useCardsStore((s) => s.hydrateFromBoard);
  const addCardStore  = useCardsStore((s) => s.add);
  const updCardStore  = useCardsStore((s) => s.update);
  const delCardStore  = useCardsStore((s) => s.remove);
  const applyMove     = useCardsStore((s) => s.applyMove);

  
  const [openCreateCol, setOpenCreateCol] = useState(false);
  const [openEditCol, setOpenEditCol] = useState(false);
  const [editingCol, setEditingCol] = useState<Column | null>(null);

  const [openCreateCard, setOpenCreateCard] = useState(false);
  const [targetColumnId, setTargetColumnId] = useState<string | null>(null);

  const [openEditCard, setOpenEditCard] = useState(false);
  const [editingCard, setEditingCard] = useState<Card | null>(null);

  
  useEffect(() => {
    (async () => {
      const full = await boardService.getFull(boardId);
      setMeta({ id: full.id, title: full.title });
      hydrateCols(boardId, full.columns);
      hydrateCards(full.columns);
    })();
  }, [boardId, hydrateCols, hydrateCards]);

  
  useBoardSocket(boardId);

  
  const columns = useColumnsStore((s) => s.byBoard[boardId] ?? EMPTY_COLS);
  const columnsSorted = useMemo(
    () => [...columns].sort((a, b) => a.order - b.order),
    [columns]
  );
  const cardsByColumn = useCardsStore((s) => s.byColumn);

  
  const refetchFull = async () => {
    const full = await boardService.getFull(boardId);
    setMeta({ id: full.id, title: full.title });
    hydrateCols(boardId, full.columns);
    hydrateCards(full.columns);
  };

  
  const onDragEnd = async ({ source, destination, draggableId }: DropResult) => {
    if (!destination) return;

    const payload = {
      cardId: String(draggableId),
      fromColumnId: String(source.droppableId),
      toColumnId: String(destination.droppableId),
      toOrder: destination.index + 1,
    };

    applyMove(payload);
    try {
      await cardService.move(payload.cardId, {
        toColumnId:
          payload.fromColumnId !== payload.toColumnId ? payload.toColumnId : undefined,
        toOrder: payload.toOrder,
      });
    } catch {
      await refetchFull();
    }
  };

  
  const onAddColumnClick = () => setOpenCreateCol(true);
  const onEditColumn = (c: Column) => {
    setEditingCol(c);
    setOpenEditCol(true);
  };
  const onDeleteColumn = (id: string) => delColStore(id);

  const onAddCard = (c: Column) => {
    setTargetColumnId(c.id);
    setOpenCreateCard(true);
  };
  const onEditCard = (c: Card) => {
    setEditingCard(c);
    setOpenEditCard(true);
  };
  const onDeleteCard = (id: string) => {
    
    const byColumn = useCardsStore.getState().byColumn;
    for (const colId in byColumn) {
      if (byColumn[colId].some((k) => k.id === id)) {
        delCardStore(colId, id);
        break;
      }
    }
  };

  if (!meta) return <main className="p-6 text-white">Loading…</main>;

  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-black to-purple-950">
      <BoardHeader title={meta.title} onAddColumn={onAddColumnClick} />


      <ColumnsScroller
        columns={columnsSorted}
        cardsByColumn={cardsByColumn}
        onDragEnd={onDragEnd}
        onEditCol={onEditColumn}
        onAddCard={onAddCard}
        onDeleteCol={onDeleteColumn}
        onEditCard={onEditCard}
        onDeleteCard={onDeleteCard}
      />

      <BoardModals
        openCreateCol={openCreateCol}
        onOpenCreateCol={setOpenCreateCol}
        boardId={meta?.id ?? null}
        onColumnCreated={(c) => addColStore(c)}
        
        openEditCol={openEditCol}
        onOpenEditCol={setOpenEditCol}
        editingCol={editingCol}
        onColumnUpdated={(c) => updColStore(c)}
        
        openCreateCard={openCreateCard}
        onOpenCreateCard={setOpenCreateCard}
        targetColumnId={targetColumnId}
        onCardCreated={(k) => addCardStore(k)}
        
        openEditCard={openEditCard}
        onOpenEditCard={setOpenEditCard}
        editingCard={editingCard}
        onCardUpdated={(k) => updCardStore(k)}
      />
    </main>
  );
}
