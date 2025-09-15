"use client";

import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog, AlertDialogTrigger, AlertDialogContent,
  AlertDialogHeader, AlertDialogTitle, AlertDialogFooter,
  AlertDialogCancel, AlertDialogAction, AlertDialogDescription
} from "@/components/ui/alert-dialog";
import { boardService } from "@/services/boardService";
import { toast } from "sonner";
import type { Board } from "@/types/board";

export const BoardTile =({
  board,
  onEdit,
  onDeleted,
}: {
  board: Board;
  onEdit: (b: Board) => void;
  onDeleted: (id: string) => void;
}) => {
  const handleDelete = async () => {
    await boardService.remove(board.id);
    toast.success("Board deleted");
    onDeleted(board.id);
  };

  return (
    <Card className="hover:shadow-lg transition bg-white/90 ">
      <CardHeader className="py-3 flex flex-col items-center justify-between sm:flex-row space-y-2 sm:space-y-0 text-center">
        <CardTitle className="text-sm sm:text-base lg:text-lg uppercase">
          <Link href={`/board/${board.id}`}>{board.title}</Link>
        </CardTitle>

        <div className="flex">
          <Button variant="ghost" size="icon" aria-label="Edit" onClick={() => onEdit(board)}>
            <Pencil className="h-4 w-4 text-cyan-700" />
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Delete">
                <Trash2 className="h-4 w-4 text-purple-900" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogDescription></AlertDialogDescription>
                <AlertDialogTitle>Delete board?</AlertDialogTitle>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardHeader>
    </Card>
  );
}
