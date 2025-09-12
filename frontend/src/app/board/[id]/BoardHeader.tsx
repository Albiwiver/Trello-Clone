"use client";

import { Button } from "@/components/ui/button";

export default function BoardHeader({
  title,
  onAddColumn,
}: {
  title: string;
  onAddColumn: () => void;
}) {
  return (
    <div className="sticky top-0 z-10 flex items-center justify-between bg-zinc-900/70 backdrop-blur px-5 py-3 lg:px-8">
      <h2 className="font-semibold text-white ml-2 sm:text-lg lg:text-xl uppercase">
        {title}
      </h2>
      <Button
        className="hover:cursor-pointer sm:text-base lg:text-lg bg-purple-900/25"
        onClick={onAddColumn}
      >
        Add Column
      </Button>
    </div>
  );
}
