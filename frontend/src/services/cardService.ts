import { api } from "./api";
import type { Card } from "@/types/card";

export const cardService = {
  create: (p: { columnId: string; title: string; content?: string }) =>
    api.post<Card>("/cards", p).then(r => r.data),

  update: (id: string, p: { title?: string; content?: string }) =>
    api.patch<Card>(`/cards/${id}`, p).then(r => r.data),

  remove: (id: string) => api.delete(`/cards/${id}`).then(() => undefined),
  
  move: (cardId: string, p: { toOrder?: number; toColumnId?: string }) =>
    api.patch<Card>(`/cards/${cardId}/move`, p).then(r => r.data),
};
