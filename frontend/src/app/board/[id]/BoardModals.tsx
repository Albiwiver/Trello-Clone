// src/app/board/[id]/BoardModals.tsx
"use client";

import type { Column } from "@/types/column";
import type { Card } from "@/types/card";

import CreateColumnDialog from "@/components/board/modals/CreateColumnDialog";
import { EditColumnDialog } from "@/components/board/modals/EditColumnDialog";
import CreateCardDialog from "@/components/board/modals/CreateCardDialog";
import { EditCardDialog } from "@/components/board/modals/EditCardDialog";

export default function BoardModals({
  
  openCreateCol,
  onOpenCreateCol,
  boardId,
  onColumnCreated,
  
  openEditCol,
  onOpenEditCol,
  editingCol,
  onColumnUpdated,
  
  openCreateCard,
  onOpenCreateCard,
  targetColumnId,
  onCardCreated,
  
  openEditCard,
  onOpenEditCard,
  editingCard,
  onCardUpdated,
}: {
  openCreateCol: boolean;
  onOpenCreateCol: (o: boolean) => void;
  boardId: string | null;
  onColumnCreated: (c: Column) => void;

  openEditCol: boolean;
  onOpenEditCol: (o: boolean) => void;
  editingCol: Column | null;
  onColumnUpdated: (c: Column) => void;

  openCreateCard: boolean;
  onOpenCreateCard: (o: boolean) => void;
  targetColumnId: string | null;
  onCardCreated: (c: Card) => void;

  openEditCard: boolean;
  onOpenEditCard: (o: boolean) => void;
  editingCard: Card | null;
  onCardUpdated: (c: Card) => void;
}) {
  return (
    <>
      <CreateColumnDialog
        open={openCreateCol}
        onOpenChange={onOpenCreateCol}
        boardId={boardId}
        onCreated={onColumnCreated}
      />

      <EditColumnDialog
        open={openEditCol}
        onOpenChange={onOpenEditCol}
        column={editingCol}
        onUpdated={onColumnUpdated}
      />

      <CreateCardDialog
        open={openCreateCard}
        onOpenChange={onOpenCreateCard}
        columnId={targetColumnId}
        onCreated={onCardCreated}
      />

      <EditCardDialog
        open={openEditCard}
        onOpenChange={onOpenEditCard}
        card={editingCard}
        onUpdated={onCardUpdated}
      />
    </>
  );
}
