// src/stores/columns.ts
import { create } from "zustand";
import type { Column } from "@/types/column";

type State = {
  byBoard: Record<string, Column[]>;
  hydrate: (boardId: string, columns: Column[]) => void;
  list: (boardId: string) => Column[];
  add: (col: Column) => void;
  update: (col: Column) => void;
  remove: (columnId: string) => void; 
};

const sortCols = (cols: Column[]) => [...cols].sort((a, b) => a.order - b.order);

export const useColumnsStore = create<State>((set, get) => ({
  byBoard: {},

  hydrate: (boardId, columns) =>
    set(s => ({ byBoard: { ...s.byBoard, [boardId]: sortCols(columns) } })),

  list: (boardId) => sortCols(get().byBoard[boardId] ?? []),

  add: (col) =>
  set((s) => {
    const list = s.byBoard[col.boardId] ?? [];
    const idx = list.findIndex((c) => c.id === col.id);
    const next =
      idx >= 0
        // si ya existe, lo reemplazamos (o merge) → idempotente
        ? list.map((c) => (c.id === col.id ? { ...c, ...col } : c))
        // si no existe, lo añadimos
        : [...list, col];

    next.sort((a, b) => a.order - b.order);
    return { byBoard: { ...s.byBoard, [col.boardId]: next } };
  }),

  update: (col) =>
    set(s => {
      const current = s.byBoard[col.boardId] ?? [];
      const next = current.map(c => (c.id === col.id ? { ...c, ...col } : c));
      return { byBoard: { ...s.byBoard, [col.boardId]: sortCols(next) } };
    }),

  remove: (columnId) =>
    set(s => {
      const byBoard = { ...s.byBoard };
      for (const bid in byBoard) {
        const before = byBoard[bid];
        const after = before.filter(c => c.id !== columnId);
        if (after.length !== before.length) {
          byBoard[bid] = after;
          break;
        }
      }
      return { byBoard };
    }),
}));
