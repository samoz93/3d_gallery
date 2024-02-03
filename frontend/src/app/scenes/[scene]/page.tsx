"use client";

import { ThreeCanvas } from "@samoz/app/3d_components/ThreeCanvas";
import { ThreeLoader } from "@samoz/app/3d_components/ThreeLoader";
import { CONFIG } from "@samoz/config";
import { SceneData } from "@samoz/data";
import { Suspense, useMemo } from "react";
import useSWR from "swr";

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

  const { data, error, isLoading } = useSWR(CONFIG.api, async () => {
    const urlParam = new URLSearchParams({
      scene: params.scene,
    }).toString();

    const res = await fetch(CONFIG.api + "/?" + urlParam, {
      method: "GET",
      headers: {
        "Content-Type": "text/plain",
      },
    });
    return await res.text();
  });

  return (
    <Suspense fallback={<ThreeLoader />}>
      <ThreeCanvas> {Scene && <Scene glsl={glsl} />}</ThreeCanvas>
    </Suspense>
  );
}
