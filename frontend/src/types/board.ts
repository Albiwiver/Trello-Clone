import { Column } from "./column";


export type Board = {
  id: string; title: string; ownerId: string; description?: string | null;
  columns: Column[];
};