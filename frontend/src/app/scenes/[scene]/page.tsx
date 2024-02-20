import { ThreeCanvas } from "@samoz/app/3d_components/ThreeCanvas";
import { ThreeLoader } from "@samoz/app/3d_components/ThreeLoader";
import { SceneData } from "@samoz/data";
import { Metadata } from "next";
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
      <ThreeCanvas> {Scene && <Scene glsl={glsl} />}</ThreeCanvas>
    </Suspense>
  );
}

export async function generateMetadata({
  params,
}: {
  params: { scene: string };
}): Promise<Metadata> {
  const id = params.scene;
  const data = SceneData.find((scene) => scene.path === id);
  return {
    title: data?.title || "Scene",
  };
}
