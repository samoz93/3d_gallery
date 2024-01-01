"use client";
export const revalidate = 0;

import { ThreeCanvas } from "@samoz/app/3d_components/ThreeCanvas";
import { CanvasWrapper } from "@samoz/app/stores/CanvasContext";

export default function ScenePage({ children }: { children: React.ReactNode }) {
  return (
    <CanvasWrapper>
      <ThreeCanvas>{children}</ThreeCanvas>
    </CanvasWrapper>
  );
}
