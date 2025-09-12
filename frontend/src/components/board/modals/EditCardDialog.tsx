// src/components/board/modals/EditCardDialog.tsx
"use client";

import { useEffect, useState } from "react";
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cardService } from "@/services/cardService";
import type { Card } from "@/types/card";

export const  EditCardDialog = ({
  open, onOpenChange, card, onUpdated,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  card: Card | null;
  onUpdated: (c: Card) => void;
}) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    setTitle(card?.title ?? "");
    setContent(card?.content ?? "");
  }, [card]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!card) return;
    const updated = await cardService.update(card.id, {
      title: title.trim(),
      content: content.trim() || undefined,
    });
    onUpdated(updated);
    toast.success('Card updated')
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogDescription></DialogDescription><DialogTitle>Edit card</DialogTitle></DialogHeader>
        <form onSubmit={onSubmit} className="space-y-3">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
          <Textarea value={content} onChange={(e) => setContent(e.target.value)} />
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
