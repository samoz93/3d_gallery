"use client";

import { ThreeCanvas } from "@samoz/components/ThreeCanvas";

export default function Template({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { scene: string };
}) {
  return <ThreeCanvas>{children}</ThreeCanvas>;
}
