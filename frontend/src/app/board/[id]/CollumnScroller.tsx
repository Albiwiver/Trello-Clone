// src/app/board/[id]/ColumnsScroller.tsx
"use client";

import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import type { Column } from "@/types/column";
import type { Card } from "@/types/card";
import { ColumnActions } from "@/components/board/ColumnActions";
import { CardItem } from "@/components/board/modals/CardItem";

export default function ColumnsScroller({
  columns,
  cardsByColumn,
  onDragEnd,
  onEditCol,
  onAddCard,
  onDeleteCol,
  onEditCard,
  onDeleteCard,
}: {
  columns: Column[];                                   
  cardsByColumn: Record<string, Card[]>;
  onDragEnd: (result: DropResult) => void;
  onEditCol: (c: Column) => void;
  onAddCard: (c: Column) => void;
  onDeleteCol: (id: string) => void;
  onEditCard: (c: Card) => void;
  onDeleteCard: (id: string) => void;
}) {
  return (
    <div className="px-4 pb-8">
      <div className="flex gap-2 sm:gap-4 overflow-x-auto py-4">
        <DragDropContext onDragEnd={onDragEnd}>
          {columns.map((col) => {
            const cards = (cardsByColumn[col.id] ?? []).slice().sort((a, b) => a.order - b.order);
            return (
              <div key={String(col.id)} className="w-60 sm:w-72 shrink-0">
                <div className="rounded-lg bg-white/5 border border-white/10">
                  <div className="px-3 py-2 font-medium flex items-center justify-between">
                    <span className="text-white">{col.title}</span>
                    <ColumnActions
                      column={col}
                      onAddCard={onAddCard}
                      onEdit={onEditCol}
                      onDeleted={onDeleteCol}
                    />
                  </div>

                  <Droppable droppableId={String(col.id)} type="CARD">
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="p-2 space-y-2 max-h-[70vh] overflow-y-auto"
                      >
                        {cards.map((card, index) => {
                          const did = String(card.id ?? "");
                          if (!did) {
                            console.warn("Card sin id:", card);
                            return null;
                          }
                          return (
                            <Draggable key={did} draggableId={did} index={index}>
                              {(drag) => (
                                <CardItem
                                  card={card}
                                  provided={drag}
                                  onEdit={onEditCard}
                                  onDeleted={onDeleteCard}
                                />
                              )}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              </div>
            );
          })}
        </DragDropContext>
      </div>
    </div>
  );
}
