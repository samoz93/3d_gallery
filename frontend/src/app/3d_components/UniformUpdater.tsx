"use client";

import { useFrame } from "@react-three/fiber";
import { ReactNode } from "react";
import { ShaderMaterial } from "three";
import CustomShaderMaterial from "three-custom-shader-material/vanilla";

export const UniformUpdater = ({
  materials,
  children,
}: {
  materials: ShaderMaterial[] | CustomShaderMaterial[];
  children: ReactNode;
  basicRotation?: boolean;
}) => {
  useFrame(({ clock }) => {
    materials.forEach((material) => {
      material.uniforms.uTime.value = clock.getElapsedTime() * 0.1;
    });
  });

  return <>{children}</>;
};
