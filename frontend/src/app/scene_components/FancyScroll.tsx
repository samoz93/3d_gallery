"use client";

import { useGLTF, useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { fancy_scroll_frag } from "@samoz/glsl";
import { useEffect, useMemo, useRef } from "react";
import { Mesh, ShaderMaterial } from "three";
import { useZStore } from "../stores/zStore";

export const FancyScroll = ({
  glsl,
}: {
  children?: React.ReactNode;
  glsl: {
    vertexShader: string;
    fragmentShader: string;
  };
}) => {
  const aspect = 1 / 2;

  const model = useGLTF("/models/female_bust/scene.gltf");

  const { scene } = model;

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

  useTexture("/textures/purble.jpg", (tex) => {
    shader.uniforms.uTexture.value = tex;
  });

  const shader = useMemo(() => {
    return new ShaderMaterial({
      vertexShader: glsl.vertexShader,
      fragmentShader: fancy_scroll_frag,
      // transparent: true,
      blending: 5,
      uniforms: {
        uTexture: { value: null },
        uTime: { value: 0 },
        uResolution: { value: resolution },
      },
    });
  }, [glsl, resolution, fancy_scroll_frag]);

  useFrame(({ clock }) => {
    shader.uniforms.uTime.value = clock.getElapsedTime() + 100;
  });

  const ref = useRef<Mesh[]>([]);
  const { updateBloom, updateField } = useZStore((state) => state);
  useEffect(() => {
    updateBloom({
      disable: true,
    });
    scene.traverse((child) => {
      if (child.type === "Mesh") {
        (child as Mesh).material = shader;
        ref.current.push(child as Mesh);
        // (child as Mesh).geometry.center();
      }
    });
    updateField({
      enableOrbit: true,
      showPlane: true,
    });
  }, []);

  return (
    <mesh position={[0, 1, 0]} scale={100}>
      <primitive object={scene}></primitive>
    </mesh>
  );
};
