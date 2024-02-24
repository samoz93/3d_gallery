"use client";

import { ThreeCanvas } from "../3d_components/ThreeCanvas";
import { ScrollTransitionCom } from "../components";

export const ScrollTransitionScene = ({
  children,
  glsl,
}: {
  glsl: {
    vertexShader: string;
    fragmentShader: string;
  };
}) => {
  return (
    <ThreeCanvas
      bloom={{
        disable: true,
        intensity: 0.5,
        smoothing: 0.5,
        threshold: 0.5,
      }}
    >
      <ScrollTransitionCom glsl={glsl} />
    </ThreeCanvas>
  );
};
