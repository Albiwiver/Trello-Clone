import { Card } from "./card";

export type Column = {
  id: string;
  title: string;
  order: number;
  boardId: string;
  cards:Card[]
};