// src/components/board/modals/CreateCardDialog.tsx
"use client";

import { useState } from "react";
import { toast, Toaster } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cardService } from "@/services/cardService";
import type { Card } from "@/types/card";

export default function CreateCardDialog({
  open, onOpenChange, columnId, onCreated,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  columnId: string | null;
  onCreated: (c: Card) => void;
}) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!columnId) return;
    const created = await cardService.create({ columnId, title: title.trim(), content: content.trim() || undefined });
    onCreated(created);
    toast.success('Card Created')
    setTitle(""); setContent("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogDescription></DialogDescription><DialogTitle>Create card</DialogTitle></DialogHeader>
        <form onSubmit={onSubmit} className="space-y-3">
          <Input placeholder="Card title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <Textarea placeholder="Details..." value={content} onChange={(e) => setContent(e.target.value)} />
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit">Create</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
