"use client";

import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { AudioComps } from "@samoz/app/components/AudioControllers";
import UniformUpdater from "@samoz/components/UniformUpdater";
import { IAudioRef } from "@types/audio.interfaces";
import { useControls } from "leva";
import { useEffect, useMemo, useRef } from "react";
import {
  Color,
  MeshDepthMaterial,
  MeshPhysicalMaterial,
  RGBADepthPacking,
} from "three";
import CustomShaderMaterial from "three-custom-shader-material/vanilla";

export const AudioVis = ({
  glsl,
}: {
  children?: React.ReactNode;
  glsl: {
    vertexShader: string;
    fragmentShader: string;
  };
}) => {
  const { uRadius, ...colors } = useControls("Audio", {
    uRadius: { value: 1, step: 0.1, min: 0, max: 10 },
    color1: { value: "red" },
    color2: { value: "green" },
    color3: { value: "blue" },
    color4: { value: "pink" },
  });

  useEffect(() => {
    const colorArr = Object.values(colors).map((c) => new Color(c));
    material.uniforms.uRadius.value = uRadius;
    depthMaterial.uniforms.uRadius.value = uRadius;
    material.uniforms.uColors.value = colorArr;
  }, [colors, uRadius]);
  const material = useMemo(
    () =>
      new CustomShaderMaterial({
        baseMaterial: new MeshPhysicalMaterial({ color: "blue" }),
        vertexShader: glsl.vertexShader,
        fragmentShader: glsl.fragmentShader,
        uniforms: {
          uRadius: { value: 1 },
          uTime: { value: 1 },
          uFrequency: { value: 1 },
          uColors: { value: Object.values(colors).map((c) => new Color(c)) },
        },
      }),
    []
  );

  const depthMaterial = useMemo(
    () =>
      new CustomShaderMaterial({
        baseMaterial: new MeshDepthMaterial({
          depthPacking: RGBADepthPacking,
          alphaTest: 0.1,
        }),
        vertexShader: glsl.vertexShader,
        fragmentShader: glsl.fragmentShader,
        uniforms: {
          uRadius: { value: 1 },
          uTime: { value: 1 },
          uFrequency: { value: 1 },
        },
      }),
    []
  );

  const ref = useRef<IAudioRef>();
  const meshRef = useRef<THREE.Mesh>();
  const meshWireframeRef = useRef<THREE.Mesh>();

  useFrame(({ clock }, delta, x) => {
    const fq = (ref.current?.getAvgFrequency() ?? 0) * 0.01;
    material.uniforms.uFrequency.value = fq;
    depthMaterial.uniforms.uFrequency.value = fq;
    if (!meshRef.current || !meshWireframeRef.current) return;

    meshRef.current.rotation.y += Math.sin(delta * 0.0005 + fq * 0.002);
    meshRef.current.rotation.x -= delta * 0.0005 + fq * 0.005;
    meshWireframeRef.current.rotation.y += Math.sin(
      delta * 0.0005 + fq * 0.002
    );
    meshWireframeRef.current.rotation.x -= delta * 0.0005 + fq * 0.005;
  });

  const lineScaler = 1.09;
  return (
    <UniformUpdater materials={[material, depthMaterial]} basicRotation>
      <mesh
        ref={meshRef}
        castShadow
        material={material}
        customDepthMaterial={depthMaterial}
      >
        <icosahedronGeometry args={[1, 100]} />
      </mesh>
      <Html fullscreen className="h-full html_cls">
        <AudioComps ref={ref} />
      </Html>
      <lineSegments
        ref={meshWireframeRef}
        scale={[lineScaler, lineScaler, lineScaler]}
        material={material}
      >
        <sphereGeometry args={[1, 100, 100]} />
      </lineSegments>
    </UniformUpdater>
  );
};
