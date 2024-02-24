import { ThreeCanvas } from "@samoz/app/3d_components/ThreeCanvas";
import { ThreeLoader } from "@samoz/app/3d_components/ThreeLoader";
import { ISceneData, SceneData } from "@samoz/data";
import { Metadata } from "next";
import { Suspense, useMemo } from "react";

type ScenePageProps = {
  comp: React.ComponentType<any>;
  glsl: { vertexShader: string; fragmentShader: string };
};

export default function ScenePage({ params }: { params: { scene: string } }) {
  const {
    comp: Scene,
    glsl,
    disableThreeJs,
  } = useMemo(() => {
    return SceneData.find(
      (scene) => scene.path === params.scene
    )! satisfies ISceneData;
  }, [params]);

  return (
    <Suspense fallback={<ThreeLoader />}>
      {disableThreeJs && <Scene glsl={glsl} />}
      {!disableThreeJs && (
        <ThreeCanvas>
          <Scene glsl={glsl} />
        </ThreeCanvas>
      )}
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
