// src/components/board/modals/EditBoardDialog.tsx
"use client";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { boardService } from "@/services/boardService";
import type { Board } from "@/types/board";
import { toast } from "sonner";

export default function EditBoardDialog({
  open, onOpenChange, board, onUpdated,
}: { open: boolean; onOpenChange: (o:boolean)=>void; board: Board|null; onUpdated:(b:Board)=>void }) {
  const [title, setTitle] = useState("");
  useEffect(() => setTitle(board?.title ?? ""), [board]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!board) return;
    const updated = await boardService.update(board.id, { title });
    onUpdated(updated);
    toast.success("Board updated", { description: updated.title });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogDescription></DialogDescription><DialogTitle>Edit board</DialogTitle></DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input value={title} onChange={e=>setTitle(e.target.value)} required />
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={()=>onOpenChange(false)}>Cancel</Button>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
