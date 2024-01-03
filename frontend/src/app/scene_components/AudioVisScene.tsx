"use client";

import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { UniformUpdater } from "@samoz/app/3d_components/UniformUpdater";
import { AudioComps } from "@samoz/app/components/AudioControllers";
import { audio_vis_2_frag, audio_vis_2_ver } from "@samoz/glsl";
import { IAudioRef } from "@types";
import { useControls } from "leva";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Color,
  MeshDepthMaterial,
  MeshPhysicalMaterial,
  RGBADepthPacking,
} from "three";
import CustomShaderMaterial from "three-custom-shader-material/vanilla";

export const AudioVisScene = ({
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

  const [version, setVersion] = useState(1);

  useEffect(() => {
    const colorArr = Object.values(colors).map((c) => new Color(c));
    material.uniforms.uRadius.value = uRadius;
    depthMaterial.uniforms.uRadius.value = uRadius;
    material.uniforms.uColors.value = colorArr;
  }, [colors, uRadius]);

  const material = useMemo(() => {
    const glslData =
      version === 1
        ? glsl
        : {
            vertexShader: audio_vis_2_ver,
            fragmentShader: audio_vis_2_frag,
          };
    return new CustomShaderMaterial({
      baseMaterial: new MeshPhysicalMaterial({ color: "blue" }),
      vertexShader: glslData.vertexShader,
      fragmentShader: glslData.fragmentShader,
      uniforms: {
        uRadius: { value: 1 },
        uTime: { value: 1 },
        uFrequency: { value: 1 },
        uColors: { value: Object.values(colors).map((c) => new Color(c)) },
      },
    });
  }, [colors, version]);

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

  const ref = useRef<IAudioRef>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const meshWireframeRef = useRef<THREE.LineSegments<any>>(null);

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
        {version === 1 ? (
          <icosahedronGeometry args={[1, 100]} />
        ) : (
          <sphereGeometry args={[1, 100, 100, 100]}></sphereGeometry>
        )}
      </mesh>
      <Html fullscreen className="h-full html_cls">
        <AudioComps onVersionChanged={setVersion} ref={ref} />
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
