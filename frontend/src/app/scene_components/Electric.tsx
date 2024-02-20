"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import { ShaderMaterial } from "three";
import { useZStore } from "../stores/zStore";

export const FollowTheLine = ({
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
      // blending: 5,
      side: 2,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: resolution },
        uTexture: { value: null },
      },
    });
  }, [glsl, resolution]);

  useFrame(({ clock, gl, scene, camera }) => {
    const time = clock.getElapsedTime();
    shader.uniforms.uTime.value = time;
  });

  const { updateBloom, updateField } = useZStore((state) => state);

  useEffect(() => {
    updateBloom({
      disable: true,
    });

    updateField({
      enableOrbit: true,
      showPlane: false,
      bgColor: "#000000",
    });
  }, []);

  return (
    <>
      <points position={[0, 0, 0]} material={shader} scale={2}>
        <icosahedronGeometry args={[1, 32]} />
      </points>
    </>
  );
};
