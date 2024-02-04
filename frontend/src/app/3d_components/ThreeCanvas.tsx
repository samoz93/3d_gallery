"use client";
import { OrbitControls, SoftShadows } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { Loader } from "@samoz/app/components/Loader";
import { folder, useControls } from "leva";
import { ReactNode, useEffect, useState } from "react";
import { useCanvasContext } from "../stores/CanvasContext";

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

  const [{ camera, bloom }] = useCanvasContext();

  const { intensity, smoothing, threshold, disable } = useControls(
    "Main Scene",
    {
      bloom: folder({
        intensity: {
          value: bloom.intensity,
          min: 0,
          max: 10,
        },
        threshold: { value: bloom.threshold || 0.4, min: 0, max: 1 },
        smoothing: { value: bloom.smoothing || 0.1, min: 0, max: 1 },
        disable: !!bloom.disable,
      }),
    }
  );

  const [isBloomDisabled, setIsBloom] = useState(disable);

  useEffect(() => {
    console.log("bloom", bloom);
    setIsBloom(bloom.disable);
  }, [bloom]);
  return (
    <div className="relative h-full w-full">
      {!isLoaded && <Loader />}

      <Canvas
        onCreated={() => setIsLoaded(true)}
        camera={{
          position: [0, 1, 5],
        }}
        color="white"
        shadows="percentage"
        className="h-full z-10 relative bg-blue-400"
      >
        <ambientLight />
        <OrbitControls enabled={!camera.disableOrbitControls} />
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
          rotation={[-Math.PI * 0.5, 0, 0]}
          position={[0, -2, 0]}
        >
          <planeGeometry args={[100, 100]} />
          <meshPhysicalMaterial color="black" />
        </mesh>

        {disable ? (
          <></>
        ) : (
          <EffectComposer>
            <Bloom
              luminanceThreshold={threshold}
              luminanceSmoothing={smoothing}
              intensity={isBloomDisabled ? 0 : intensity}
              height={300}
            />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  );
};
