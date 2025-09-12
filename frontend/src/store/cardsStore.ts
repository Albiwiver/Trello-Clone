// src/stores/cards.ts
import { create } from "zustand";
import type { Card } from "@/types/card";

type State = {
  byColumn: Record<string, Card[]>;
  hydrateFromBoard: (columns: { id: string; cards?: Card[] }[]) => void;
  list: (columnId: string) => Card[];
  add: (card: Card) => void;
  update: (card: Card) => void;
  remove: (columnId: string, cardId: string) => void;
  applyMove: (p: { cardId: string; fromColumnId: string; toColumnId: string; toOrder: number }) => void;
};

const sorted = (arr: Card[]) =>
  [...arr].sort((a, b) => a.order - b.order).map((c, i) => ({ ...c, order: i + 1 }));

export const useCardsStore = create<State>((set, get) => ({
  byColumn: {},

  hydrateFromBoard: (columns) =>
    set(s => {
      const byColumn = { ...s.byColumn };
      for (const c of columns) {
        byColumn[c.id] = sorted(c.cards ?? []);
      }
      return { byColumn };
    }),

  list: (columnId) => sorted(get().byColumn[columnId] ?? []),

  add: (card) =>
    set(s => {
      const next = sorted([...(s.byColumn[card.columnId] ?? []), card]);
      return { byColumn: { ...s.byColumn, [card.columnId]: next } };
    }),

  update: (card) =>
    set(s => {
      const arr = s.byColumn[card.columnId] ?? [];
      const next = sorted(arr.map(k => (k.id === card.id ? { ...k, ...card } : k)));
      return { byColumn: { ...s.byColumn, [card.columnId]: next } };
    }),

  remove: (columnId, cardId) =>
    set(s => {
      const next = sorted((s.byColumn[columnId] ?? []).filter(k => k.id !== cardId));
      return { byColumn: { ...s.byColumn, [columnId]: next } };
    }),

  applyMove: ({ cardId, fromColumnId, toColumnId, toOrder }) =>
    set(s => {
      const byColumn = { ...s.byColumn };
      const from = [...(byColumn[fromColumnId] ?? [])];
      const to = [...(byColumn[toColumnId] ?? [])];
      const idx = from.findIndex(k => k.id === cardId);
      if (idx === -1) return s;

      const [moved] = from.splice(idx, 1);
      moved.columnId = toColumnId;
      moved.order = toOrder;

      // Inserta en destino en posición 1-based -> index 0-based
      to.splice(Math.max(0, toOrder - 1), 0, moved);

      byColumn[fromColumnId] = sorted(from);
      byColumn[toColumnId] = sorted(to);
      return { byColumn };
    }),
}));
