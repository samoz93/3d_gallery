import { OrbitControls, Sky, SoftShadows } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { folder, useControls } from "leva";
import { ReactNode, useState } from "react";

export const ThreeCanvas = ({
  children,
  bloom,
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
  const { intensity, smoothing, threshold, disable } = useControls(
    "Main Scene",
    {
      bloom: folder({
        intensity: { value: bloom?.intensity || 1.1, min: 0, max: 10 },
        threshold: { value: bloom?.threshold || 0.4, min: 0, max: 1 },
        smoothing: { value: bloom?.smoothing || 0.1, min: 0, max: 1 },
        disable: !!bloom?.disable,
      }),
    }
  );
  return (
    <div className="relative h-full w-full">
      {!isLoaded && (
        <p className="absolute top-1/2 z-20 text-white left-1/2">Is Loading </p>
      )}

      <Canvas
        onCreated={() => setIsLoaded(true)}
        camera={{
          position: [5, 5, 2],
        }}
        shadows="percentage"
        className="h-full z-10 relative"
      >
        <ambientLight />
        <OrbitControls />
        <directionalLight
          castShadow
          color={"white"}
          intensity={10}
          position={[0, 3, 10]}
        ></directionalLight>
        <SoftShadows size={0.5} samples={10} focus={1} />
        {children}
        <Sky />
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
              intensity={disable ? 0 : intensity}
              height={300}
            />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  );
};
