// src/components/board/CardItem.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import {
  AlertDialog, AlertDialogTrigger, AlertDialogContent,
  AlertDialogHeader, AlertDialogTitle, AlertDialogFooter,
  AlertDialogCancel, AlertDialogAction, AlertDialogDescription
} from "@/components/ui/alert-dialog";
import type { Card } from "@/types/card";
import { cardService } from "@/services/cardService";
import { toast } from "sonner";
import type {
  DraggableProvided,
} from "@hello-pangea/dnd";

export const CardItem = ({
  card,
  provided,
  onEdit,
  onDeleted,
}: {
  card: Card;
  provided: DraggableProvided; 
  onEdit: (c: Card) => void;
  onDeleted: (id: string) => void;
}) => {
  const handleDelete = async () => {
    await cardService.remove(card.id);
    toast.success("Card deleted");
    onDeleted(card.id);
  };

  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      className="rounded-md bg-white/10 border border-white/10 p-2 text-sm"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="font-medium text-white sm:text-base">{card.title}</div>
          {card.content && (
            <p className="text-white/70 text-xs sm:text-sm line-clamp-3 mt-1">{card.content}</p>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="ghost" size="icon" aria-label="Edit" onClick={() => onEdit(card)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Delete">
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader><AlertDialogDescription></AlertDialogDescription><AlertDialogTitle>Delete this card?</AlertDialogTitle></AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}
