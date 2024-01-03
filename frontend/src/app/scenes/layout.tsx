"use client";

import { LayoutProps } from "@next/types/app/page";
import { Leva } from "leva";

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col h-full relative">
      <header className="absolute top-0 left-0 z-10 items-center min-h-12 h-[8%] justify-center w-full">
        <h1 className="text-3xl"></h1>
      </header>
      <main className="h-full">
        <Leva collapsed />
        {children}
      </main>
    </div>
  );
}
