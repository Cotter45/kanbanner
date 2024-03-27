"use client";

// KanbanCol.tsx
import React from "react";
import { FixedSizeList } from "react-window";
import { SortableContext } from "@dnd-kit/sortable";

import { KanbanItem } from "./KanbanItem";

interface KanbanColProps<T> {
  id: string;
  title: string;
  items: (T & { id: string | number })[];
  handleAddItem: (columnId: string) => Promise<void>;
  renderItem: (item: T & { id: string | number }) => React.ReactNode;
}

function KanbanCol<T>({
  id,
  title,
  items,
  handleAddItem,
  renderItem,
}: KanbanColProps<T>) {
  const Row = ({
    index,
    style,
  }: {
    index: number;
    style: React.CSSProperties;
  }) => (
    <li style={style}>
      <KanbanItem
        key={items[index].id}
        item={items[index]}
        renderItem={renderItem}
      />
    </li>
  );

  const addItem = async () => {
    await handleAddItem(id);
  };

  return (
    <article className="relative overflow-auto flex flex-col gap-2 min-w-[350px] min-h-[300px] bg-white dark:bg-[#02040A] border border-zinc-200 dark:border-zinc-600 rounded-md">
      <div className="sticky top-0 left-0 border-b border-zinc-400 dark:border-zinc-600 bg-white dark:bg-[#02040A] shadow-md shadow-black dark:shadow-zinc-800 px-2 py-4 z-[1000] flex items-center justify-between">
        <h3>{title}</h3>

        <div className="flex items-center gap-1">
          <button
            onClick={addItem}
            className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-600 rounded-md"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </button>

          <span className="px-2 py-1 bg-zinc-200 dark:bg-zinc-600 text-zinc-900 dark:text-zinc-100 rounded-md text-xs flex items-center h-fit">
            {items.length}
          </span>
        </div>
      </div>

      <SortableContext id={id} items={items.map((item) => item.id)}>
        <FixedSizeList
          height={800} // Adjust height as needed
          itemCount={items.length}
          itemSize={65} // Adjust itemSize as needed
          width="98%"
          style={{
            listStyleType: "none",
            marginLeft: "0.2rem",
            marginTop: "0.2rem",
          }}
        >
          {Row}
        </FixedSizeList>
      </SortableContext>
    </article>
  );
}

export { KanbanCol };
