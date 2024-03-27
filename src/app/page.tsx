"use client";

import { useState } from "react";

import { Kanban, type IKanbanColumn } from "@/components/kanban";
import { useDeviceDetection } from "@/hooks/useDeviceDetection";

const fiveHundredRandomTasks = Array.from({ length: 500 }, (_, i) => ({
  id: i.toString(),
  title: `Task ${i + 1}`,
}));

const oneHundreddMoreRandomTasks = Array.from({ length: 100 }, (_, i) => ({
  id: (i + 501).toString(),
  title: `Task ${i + 501}`,
}));

const fiveHundredMoreRandomTasks = Array.from({ length: 1500 }, (_, i) => ({
  id: (i + 601).toString(),
  title: `Task ${i + 601}`,
}));

export default function Home() {
  const device = useDeviceDetection();

  const [columns, setColumns] = useState<IKanbanColumn<any>[]>([
    {
      id: "column-1",
      title: "To Do",
      items: fiveHundredRandomTasks,
    },
    {
      id: "column-2",
      title: "In Progress",
      items: oneHundreddMoreRandomTasks,
    },
    {
      id: "column-3",
      title: "Done",
      items: fiveHundredMoreRandomTasks,
    },
  ]);

  const handleAddItem = async (columnId: string) => {
    const newTaskId =
      columns.map((column) => column.items.length).reduce((a, b) => a + b, 0) +
      1;
    const newTask = {
      id: newTaskId.toString(),
      title: `Task ${newTaskId}`,
    };

    const newColumns = columns.map((column) => {
      if (column.id === columnId) {
        return {
          ...column,
          items: [...column.items, newTask],
        };
      }

      return column;
    });

    setColumns(newColumns);
  };

  const handleAddColumn = async (title: string) => {
    if (title.trim() !== "") {
      const newColumnId = `column-${columns.length + 1}`;
      const newColumn = {
        id: newColumnId,
        title: title.trim(),
        items: [],
      };
      setColumns([...columns, newColumn]);
    }
  };

  return (
    <main className="relative no-scrollbar flex overflow-auto w-full h-[100dvh] flex-col py-5 px-2 bg-[#0C1117] text-white">
      <Kanban
        device={device}
        columns={columns}
        setColumns={setColumns}
        handleAddColumn={handleAddColumn}
        handleAddItem={handleAddItem}
        renderItem={(item: any) => (
          <div className="w-full px-2 py-4 border border-zinc-600 rounded-md bg-[#161B22]">
            {item.title}
          </div>
        )}
      />
    </main>
  );
}
