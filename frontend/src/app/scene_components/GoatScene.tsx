"use client";

import { useGLTF, useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { Group, Mesh, ShaderMaterial, Texture } from "three";
import { UniformUpdater } from "../3d_components/UniformUpdater";
import { useCanvasContext } from "../stores/CanvasContext";

export const GoatScene = ({
  glsl,
}: {
  glsl: { vertexShader: string; fragmentShader: string };
}) => {
  const [, dispatch] = useCanvasContext();

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

  useEffect(() => {
    dispatch({
      type: "DISABLE_BLOOM",
    });
    dispatch({
      type: "DISABLE_ORBIT_CONTROLS",
    });

    return () => {
      dispatch({
        type: "ENABLE_BLOOM",
      });
      dispatch({
        type: "ENABLE_ORBIT_CONTROLS",
      });
    };
  }, []);

  return (
    <UniformUpdater materials={[material]}>
      <group ref={ref} scale={2}>
        <primitive object={scene} />
        {/* <primitive object={handle} /> */}
      </group>
    </UniformUpdater>
  );
};
