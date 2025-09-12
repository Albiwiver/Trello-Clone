"use client";

import { Button } from "@/components/ui/button";
import { Pencil, Plus, Trash2 } from "lucide-react";
import {
  AlertDialog, AlertDialogTrigger, AlertDialogContent,
  AlertDialogHeader, AlertDialogTitle, AlertDialogFooter,
  AlertDialogCancel, AlertDialogAction, AlertDialogDescription
} from "@/components/ui/alert-dialog";
import type { Column } from "@/types/column";
import { columnService } from "@/services/columnService";
import { toast } from "sonner";

export const ColumnActions = ({
  column,
  onEdit,
  onAddCard,
  onDeleted,
}: {
  column: Column;
  onEdit: (c: Column) => void;
  onAddCard: (c: Column) => void
  onDeleted: (id: string) => void;
}) => {
  const handleDelete = async () => {
    await columnService.remove(column.id);
    toast.success("Column deleted");
    onDeleted(column.id);
  };

  return (
    <div className="flex items-center gap-1">
      <Button className="hover:bg-black hover:border-1 hover:border-white hover:cursor-pointer mr-4 sm:mr-10" variant="ghost" size="icon" aria-label="Add card" onClick={() => onAddCard(column)}>
        <Plus className="h-6 w-6 text-white" />
      </Button>
      <Button variant="ghost" size="icon" aria-label="Edit column" onClick={() => onEdit(column)}>
        <Pencil className="h-4 w-4 text-cyan-700" />
      </Button>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Delete column">
            <Trash2 className="h-4 w-4 text-purple-900" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogDescription></AlertDialogDescription><AlertDialogTitle>{`Delete ${column.title} column?`}</AlertDialogTitle></AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
