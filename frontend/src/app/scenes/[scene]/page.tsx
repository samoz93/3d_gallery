"use client";
export const revalidate = 0;

import { ThreeLoader } from "@samoz/app/3d_components/ThreeLoader";
import { SceneData } from "@samoz/data";
import { Suspense, useMemo } from "react";

type ScenePageProps = {
  comp: React.ComponentType<any>;
  glsl: { vertexShader: string; fragmentShader: string };
};

export default function ScenePage({ params }: { params: { scene: string } }) {
  const { comp: Scene, glsl } = useMemo(() => {
    return (
      SceneData.find((scene) => scene.path === params.scene) ||
      ({} as ScenePageProps)
    );
  }, [params.scene]);
  return (
    <Suspense fallback={<ThreeLoader />}>
      {Scene && <Scene glsl={glsl} />}
    </Suspense>
  );
}
