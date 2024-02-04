"use client";

import { OrbitControls, OrthographicCamera } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useControls } from "leva";
import { useEffect, useMemo } from "react";
import { Color, ShaderMaterial } from "three";
import { useZStore } from "../stores/zStore";

const { sin, cos } = Math;

export const PlayfulChildren = ({
  glsl,
}: {
  children?: React.ReactNode;
  glsl: {
    vertexShader: string;
    fragmentShader: string;
  };
}) => {
  const aspect = 853 / 1200;
  useControls("Playfulness color mixer", {
    uColor: {
      value: "#dfff00",
      label: "Color 1",
      onChange: (v) => {
        shader.uniforms.uColor.value = new Color(v);
      },
    },
    uColor2: {
      value: "#0000ff",
      label: "Color 2",
      onChange: (v) => {
        shader.uniforms.uColor2.value = new Color(v);
      },
    },
    uColor3: {
      value: "#000003",
      label: "Color 2",
      onChange: (v) => {
        shader.uniforms.uColor3.value = new Color(v);
      },
    },
    uColor4: {
      value: "#e52e2e",
      label: "Color 2",
      onChange: (v) => {
        shader.uniforms.uColor4.value = new Color(v);
      },
    },
  });
  const resolution = useMemo(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    let a1, a2;
    if (width / height > aspect) {
      a1 = (width / height) * aspect;
      a2 = 1;
    } else {
      a1 = 1;
      a2 = height / width / aspect;
    }
    return { x: width, y: height, z: a1, w: a2 };
  }, [aspect]);

  const shader = useMemo(() => {
    return new ShaderMaterial({
      vertexShader: glsl.vertexShader,
      fragmentShader: glsl.fragmentShader,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      wireframe: false,
      // blendAlpha: 0.5,
      blending: 5,
      uniforms: {
        uTexture: { value: null },
        uTime: { value: 0 },
        uResolution: { value: resolution },
        uColor: { value: new Color("#0000ff") },
        uColor2: { value: new Color("#ff0000") },
        uColor3: { value: new Color("#0000ff") },
        uColor4: { value: new Color("#ff0000") },
      },
    });
  }, [glsl]);

  useFrame(({ clock }) => {
    shader.uniforms.uTime.value = clock.getElapsedTime() + 100;
  });

  const { updateBloom, updateField } = useZStore((state) => state);
  useEffect(() => {
    updateBloom({
      disable: true,
    });
    updateField({
      showPlane: false,
      perspective: false,
      enableOrbit: false,
    });
  }, []);
  const { viewport } = useThree();
  return (
    <>
      <OrthographicCamera makeDefault zoom={50} />
      <OrbitControls makeDefault />
      <group scale={1} position={[0, 0, -1]}>
        <mesh material={shader}>
          <planeGeometry args={[viewport.width, viewport.height, 1]} />
        </mesh>
      </group>
    </>
  );
};
