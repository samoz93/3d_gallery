"use client";

import { useGLTF, useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Group, Mesh, ShaderMaterial, Texture } from "three";
import { UniformUpdater } from "../3d_components/UniformUpdater";

export const GoatScene = ({
  glsl,
}: {
  glsl: { vertexShader: string; fragmentShader: string };
}) => {
  const { scene } = useGLTF("/models/goat.glb", true);
  const material = new ShaderMaterial({
    vertexShader: glsl.vertexShader,
    fragmentShader: glsl.fragmentShader,
    side: 2,
    uniforms: {
      uTime: { value: 1 },
      uTexture: { value: new Texture() },
    },
  });

  useTexture("/textures/fire.jpg", (texture) => {
    material.uniforms.uTexture.value = texture;
  });

  scene.traverse((child) => {
    if (child instanceof Mesh) {
      child.castShadow = true;
      child.receiveShadow = true;
      child.material = material;
    }
  });

  const ref = useRef<Group<any>>(null);

  useFrame(({ clock }) => {
    ref.current!.rotation.y += clock.getElapsedTime() * 0.0001;
  });
  return (
    <UniformUpdater materials={[material]}>
      <group ref={ref} scale={2}>
        <primitive object={scene} />
        {/* <primitive object={handle} /> */}
      </group>
    </UniformUpdater>
  );
};
