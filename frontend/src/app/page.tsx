// src/app/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { BoardsGrid } from "@/components/boards/BoardsGrid";
import CreateBoardDialog from "@/components/board/modals/CreateBoardDialog";
import EditBoardDialog from "@/components/board/modals/EditBoardDialog";
import { boardService } from "@/services/boardService";
import type { Board } from "@/types/board";


export default function Home() {
  const [open, setOpen] = useState(false);
  const [boards, setBoards] = useState<Board[]>([]);
  const [openEdit, setOpenEdit] = useState(false);
  const [editing, setEditing] = useState<Board | null>(null);

  useEffect(() => {
    boardService.getAll().then(setBoards).catch(() => setBoards([]));
  }, []);

  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-black to-purple-950">
      <section className="max-w-5xl mx-auto px-4 py-10 text-center">
        <h1 className="text-2xl sm:text-3xl font-semibold text-white brightness-150">Welcome to Trello-Clone!!</h1>
        <p className="text-white/70 mt-2">The perfect way to management your tasks.</p>
        <div className="mt-6">
          <Button className="hover:cursor-pointer sm:text-base lg:py-6 lg:px-6"  onClick={() => setOpen(true)}>Create a new board</Button>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 pb-16">
        <BoardsGrid boards={boards} onEdit={(b) => {setEditing(b); setOpenEdit(true)}} onDeleted={(id) => setBoards((prev) => prev.filter((b) => b.id !== id))}/>
      </section>

      <CreateBoardDialog
        open={open}
        onOpenChange={setOpen}
        onCreated={(b) => setBoards(prev => [b, ...prev])} 
      />

      <EditBoardDialog
        open={openEdit}
        onOpenChange={setOpenEdit}
        board={editing}
        onUpdated={(u) => setBoards((prev) => prev.map((x) => (x.id === u.id ? u : x)))}
/>
      
    </main>
  );
}
