import { api } from "./api";
import type { Column } from "@/types/column";

export const columnService = {

  create: (p: { boardId: string; title: string }) =>
    api.post<Column>("/columns", p).then(r => r.data),

  update: (id: string, p: { title?: string }) =>
    api.patch<Column>(`/columns/${id}`, p).then(r => r.data),

  remove: (id: string) => api.delete(`/columns/${id}`).then(() => undefined),
};
