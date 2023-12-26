"use client";

import { useFrame } from "@react-three/fiber";
import { ReactNode } from "react";
import { ShaderMaterial } from "three";

export default function UniformUpdater({
  materials,
  basicRotation,
  children,
}: {
  materials: ShaderMaterial[];
  children: ReactNode;
  basicRotation?: boolean;
}) {
  useFrame(({ clock }) => {
    materials.forEach((material) => {
      material.uniforms.uTime.value = clock.getElapsedTime() * 0.1;
    });
  });

  return <>{children}</>;
}
