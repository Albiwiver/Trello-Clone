// src/components/board/modals/CreateColumnDialog.tsx
"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Column } from "@/types/column";
import { columnService } from "@/services/columnService";

export default function CreateColumnDialog({
  open,
  onOpenChange,
  boardId,
  onCreated,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  boardId: string | null;
  onCreated: (c: Column) => void;
}) {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!boardId || !title.trim()) return;
    setLoading(true);
    try {
      const col = await columnService.create({ boardId, title: title.trim() });
      onCreated(col);
      toast.success('Column created')
      setTitle("");
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create column</DialogTitle>
          <DialogDescription>Name your new column.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-3">
          <Input
            placeholder="Column title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
