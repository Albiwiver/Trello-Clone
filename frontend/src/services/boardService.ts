import { api } from "./api"
import { Board } from "@/types/board"



export const boardService = {

    getAll: () => api.get<Board[]>("/boards").then(r => r.data),

    getOwnedBy: (userId: string) =>
    api.get<Board[]>(`/users/${userId}/owned-boards`).then(r => r.data),

    getFull: (id: string) => api.get<Board>(`/boards/${id}/full`).then(r => r.data),
    
    create: (payload: { title: string; ownerId: string; description?: string }): Promise<Board> =>
     api.post<Board>("/boards", payload).then(res => res.data),

    update: (id: string, p: { title?: string; description?: string }) =>
    api.patch<Board>(`/boards/${id}`, p).then(r => r.data),

    remove: (id: string) =>
    api.delete<void>(`/boards/${id}`).then(() => undefined),

}