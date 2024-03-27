"use client";

import React, { useCallback, useMemo } from "react";
import { useSortable } from "@dnd-kit/sortable";

interface KanbanItemProps<T> {
  item: T & { id: string | number };
  renderItem: (item: T & { id: string | number }) => React.ReactNode;
}

const comments = [
  "No content here friend.",
  "Looks like we're starting from scratch.",
  "Nothing to see here yet.",
  "Empty space, ready for action.",
  "This area is waiting for your input.",
  "Still empty, waiting for content.",
  "No content available at the moment.",
  "All clear, no content to display.",
  "It's a blank canvas for now.",
  "This space is feeling a bit lonely.",
  "Empty, but not for long!",
  "Need something here? Let's add it!",
  "Just an empty spot for now.",
  "This area is patiently waiting.",
  "Let's fill this empty space soon.",
  "Nothing here yet, but it's ready.",
  "Still waiting for some content.",
  "Blank slate, ready for your ideas.",
  "This space is eager for content.",
  "Just a placeholder for now.",
];

function KanbanItem<T>({ item, renderItem }: KanbanItemProps<T>) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    transition,
    touchAction: "manipulation",
  };

  const randomComment = useMemo(() => {
    return comments[Math.floor(Math.random() * comments.length)];
  }, []);

  if (typeof item.id === "string" && item.id.includes("placeholder")) {
    return (
      <li
        className="text-sm text-center pt-8"
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
      >
        {randomComment}
      </li>
    );
  }

  return (
    <li ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {renderItem(item)}
    </li>
  );
}

export { KanbanItem };
