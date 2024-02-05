"use client";

import { OrbitControls, OrthographicCamera } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import { Color, ShaderMaterial, Vector2 } from "three";
import { useZStore } from "../stores/zStore";

const { sin, cos } = Math;

export const ScreenSaverScene = ({
  glsl,
}: {
  children?: React.ReactNode;
  glsl: {
    vertexShader: string;
    fragmentShader: string;
  };
}) => {
  const aspect = 1 / 2;
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
        uMouse: { value: new Vector2(0) },
        uColor: { value: new Color("#0000ff") },
      },
    });
  }, [glsl]);

  useFrame(({ clock }) => {
    shader.uniforms.uTime.value = clock.getElapsedTime() + 100;
  });

  const { updateBloom, updateField } = useZStore((state) => state);
  const { gl, viewport } = useThree();

  useEffect(() => {
    updateBloom({
      disable: true,
    });
    updateField({
      showPlane: false,
      perspective: false,
      enableOrbit: false,
    });

    const pointerEvents = (e: PointerEvent) => {
      const x = e.clientX / window.innerWidth - 0.5;
      const y = -e.clientY / window.innerHeight + 0.5;
      shader.uniforms.uMouse.value.x = x;
      shader.uniforms.uMouse.value.y = y;
    };
    window.addEventListener("pointermove", pointerEvents);

    return () => {
      window.removeEventListener("pointermove", pointerEvents);
    };
  }, []);

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
