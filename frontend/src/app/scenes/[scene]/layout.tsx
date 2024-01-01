"use client";
export const revalidate = 0;

import { ThreeCanvas } from "@samoz/app/3d_components/ThreeCanvas";

export default function ScenePage({ children }: { children: React.ReactNode }) {
  return <ThreeCanvas>{children}</ThreeCanvas>;
}
