// src/components/board/modals/CreateBoardDialog.tsx
"use client";

import { useState } from "react";
import { useUserStore } from "@/store/userStore";
import { boardService } from "@/services/boardService";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { Board } from "@/types/board";
import { toast } from "sonner";

export default function CreateBoardDialog({
  open, onOpenChange, onCreated,
}: { open: boolean; onOpenChange: (o: boolean) => void; onCreated: (b: Board) => void }) {
  const ownerId = useUserStore(s => s.currentUser?.id);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ownerId) return setError("You have to login");
    setError(null); setLoading(true);
    try {
      const board = await boardService.create({ title, ownerId });
      onCreated(board);
      toast.success('Board created', {description: board.title })       
      setTitle("");
      onOpenChange(false);
    } catch {
      toast.error('Error happened while creating board')
      setError("Board could not be created");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle><DialogDescription></DialogDescription>Create a new board</DialogTitle></DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input value={title} onChange={e => setTitle(e.target.value)} required />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={loading}>{loading ? "Creating..." : "Create board"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
