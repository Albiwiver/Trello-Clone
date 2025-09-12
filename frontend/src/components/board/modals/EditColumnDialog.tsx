"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Column } from "@/types/column";
import { columnService } from "@/services/columnService";
import { toast } from "sonner";

export const EditColumnDialog = ({
  open, onOpenChange, column, onUpdated,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  column: Column | null;
  onUpdated: (c: Column) => void;
}) => {
  const [title, setTitle] = useState("");
  useEffect(() => setTitle(column?.title ?? ""), [column]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!column) return;
    const updated = await columnService.update(column.id, { title });
    onUpdated(updated);
    toast.success("Column updated");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogDescription></DialogDescription><DialogTitle>Edit column</DialogTitle></DialogHeader>
        <form onSubmit={onSubmit} className="space-y-3">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
