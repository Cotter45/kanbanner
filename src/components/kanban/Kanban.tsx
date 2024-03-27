"use client";

// Kanban.tsx
import React, { useEffect, useState } from "react";
import {
  DndContext,
  DragEndEvent,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  TouchSensor,
} from "@dnd-kit/core";

import { KanbanCol } from "./KanbanCol";

export interface IKanbanColumn<T> {
  id: string;
  title: string;
  items: (T & { id: string | number })[];
}

interface IKanbanProps<T> {
  columns: IKanbanColumn<T>[];
  setColumns: React.Dispatch<React.SetStateAction<IKanbanColumn<T>[]>>;
  handleAddColumn: (title: string) => Promise<void>;
  handleAddItem: (columnId: string) => Promise<void>;
  renderItem: (item: T) => React.ReactNode;
}

function Kanban<T>({
  columns,
  setColumns,
  handleAddColumn,
  handleAddItem,
  renderItem,
}: IKanbanProps<T>) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const [activeItem, setActiveItem] = useState<any>(null);
  const [newColumnTitle, setNewColumnTitle] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor),
    useSensor(TouchSensor)
  );

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    const activeId = active.id as string;
    const overId = over?.id as string | undefined;

    if (overId && activeId !== overId) {
      const from = findItemIndex(columns, activeId);
      const to = findItemIndex(columns, overId);

      if (from) {
        let updatedColumns = [...columns];
        const [movedItem] = updatedColumns[from.column].items.splice(
          from.index,
          1
        );

        if (to) {
          updatedColumns[to.column].items.splice(to.index, 0, movedItem);
        } else if (overId.endsWith("-placeholder")) {
          const columnIndex = updatedColumns.findIndex(
            (column) => `${column.id}-placeholder` === overId
          );
          if (columnIndex !== -1) {
            updatedColumns[columnIndex].items.push(movedItem);
          }
        }

        setColumns(updatedColumns);
      }
    }
  };

  const onDragStart = (event: any) => {
    const { active } = event;
    const id = active?.id;

    if (id) {
      const item = columns
        .map((column) => column.items)
        .flat()
        .find((item) => item.id === id);
      setActiveItem(item);
    }
  };

  const addColumn = async () => {
    await handleAddColumn(newColumnTitle);
    setNewColumnTitle("");
  };

  if (!isClient) {
    return null;
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={onDragEnd}
      onDragStart={onDragStart}
    >
      <div className="h-full flex gap-2">
        {columns.map((column) => (
          <KanbanCol<T>
            key={column.id}
            id={column.id}
            title={column.title}
            handleAddItem={handleAddItem}
            items={
              column.items.length === 0
                ? ([{ id: `${column.id}-placeholder`, title: "" }] as any)
                : column.items
            }
            renderItem={renderItem}
          />
        ))}

        {/* Form column for adding new columns */}
        <article className="flex flex-col gap-2 min-w-[350px] min-h-[300px] border border-zinc-200 dark:border-zinc-600 rounded-md p-2">
          <input
            type="text"
            value={newColumnTitle}
            onChange={(e) => setNewColumnTitle(e.target.value)}
            placeholder="Enter new column title"
            className="border border-zinc-200 dark:border-zinc-600 rounded-md px-2 py-1 bg-zinc-200 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent w-full"
          />
          <button
            onClick={addColumn}
            className="bg-teal-700 text-white px-4 py-2 rounded-md hover:bg-teal-600 mr-auto bg-transparent"
          >
            Add Column
          </button>
        </article>
      </div>

      <DragOverlay>
        {activeItem ? (
          <div>{renderItem(activeItem)}</div>
        ) : (
          <div className="invisible">invisible</div>
        )}
      </DragOverlay>
    </DndContext>
  );
}

function findItemIndex<T>(columns: IKanbanColumn<T>[], itemId: string) {
  for (const [columnIndex, column] of Array.from(columns.entries())) {
    const itemIndex = column.items.findIndex((item) => item.id === itemId);
    if (itemIndex !== -1) {
      return { column: columnIndex, index: itemIndex };
    }
  }
  return null;
}

export { Kanban };
