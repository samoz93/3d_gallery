"use client";
import { OrbitControls, SoftShadows } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { Loader } from "@samoz/app/components/Loader";
import { folder, useControls } from "leva";
import { ReactNode, useEffect, useState } from "react";
import { Vector3Tuple } from "three";
import { useZStore } from "../stores/zStore";

export const ThreeCanvas = ({
  children,
}: {
  children: ReactNode;
  bloom?: {
    intensity: number;
    smoothing: number;
    threshold: number;
    disable: boolean;
  };
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const bloom = useZStore((state) => state.bloom);
  const field = useZStore((state) => state.filed);
  const ctrl = useControls("Main Scene", {
    bloom: folder({
      intensity: {
        value: bloom.intensity,
        min: 0,
        max: 10,
      },
      threshold: { value: bloom.threshold || 0.4, min: 0, max: 1 },
      smoothing: { value: bloom.smoothing || 0.1, min: 0, max: 1 },
      disable: bloom.disable,
    }),
  });

  useEffect(() => {
    useZStore.setState({
      bloom: {
        intensity: ctrl.intensity,
        threshold: ctrl.threshold,
        smoothing: ctrl.smoothing,
        disable: ctrl.disable,
      },
    });
  }, [ctrl]);

  const cameraPos: Vector3Tuple = field.perspective ? [0, 1, 5] : [0, 0, 5];
  return (
    <div className="relative h-full w-full">
      {!isLoaded && <Loader />}

      <Canvas
        onCreated={() => setIsLoaded(true)}
        camera={{
          position: cameraPos,
          zoom: field.perspective ? 1 : 50,
        }}
        orthographic={!field.perspective}
        color="white"
        shadows="percentage"
        className="h-full z-10 relative bg-blue-400"
      >
        <ambientLight />
        <OrbitControls enabled={field.enableOrbit} />
        <directionalLight
          castShadow
          color={"white"}
          intensity={10}
          position={[0, 3, 10]}
        ></directionalLight>
        <SoftShadows size={0.5} samples={10} focus={1} />
        {children}
        {/* <Sky /> */}
        <mesh
          receiveShadow
          visible={field.showPlane && field.perspective}
          rotation={[-Math.PI * 0.5, 0, 0]}
          position={[0, -2, 0]}
        >
          <planeGeometry args={[100, 100]} />
          <meshPhysicalMaterial color="black" />
        </mesh>

        {bloom.disable ? (
          <></>
        ) : (
          <EffectComposer>
            <Bloom
              luminanceThreshold={bloom.threshold}
              luminanceSmoothing={bloom.smoothing}
              intensity={bloom.disable ? 0 : bloom.intensity}
              height={300}
            />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  );
};
