"use client";
import { ThreeCanvas } from "@samoz/components/ThreeCanvas";

export default function ScenePage({ children }: { children: React.ReactNode }) {
  return <ThreeCanvas>{children}</ThreeCanvas>;
}
