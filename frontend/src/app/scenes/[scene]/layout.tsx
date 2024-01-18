"use client";
export const revalidate = 0;

import { CanvasWrapper } from "@samoz/app/stores/CanvasContext";

export default function ScenePage({ children }: { children: React.ReactNode }) {
  return <CanvasWrapper>{children}</CanvasWrapper>;
}
