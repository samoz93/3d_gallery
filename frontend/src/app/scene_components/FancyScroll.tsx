"use client";

import { useGLTF, useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
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

  const model = useGLTF("/models/hanami.glb");

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

  const frag = `uniform float uTime;
  varying vec2 vUv;
  varying vec3 vNormal;
  uniform vec4 uResolution;
  uniform vec2 uMouse;
  uniform float uProgress;
  uniform sampler2D uTexture;
  
  const float PI = 3.14159265359;
  const float tMax = 100.0;
  
  void main() {
      vec4 tex = texture2D(uTexture, vUv);
      float light = dot(vNormal, vec3(1.));
      light = abs(light);
      vec3 color = vec3(light);
      gl_FragColor =  vec4(tex.xyz,1.);
  }`;

  useTexture("/textures/img.webp", (tex) => {
    shader.uniforms.uTexture.value = tex;
  });

  const shader = useMemo(() => {
    return new ShaderMaterial({
      vertexShader: glsl.vertexShader,
      fragmentShader: frag,
      transparent: true,
      blending: 5,
      uniforms: {
        uTexture: { value: null },
        uTime: { value: 0 },
        uResolution: { value: resolution },
      },
    });
  }, [glsl, resolution]);

  useFrame(({ clock }) => {
    shader.uniforms.uTime.value = clock.getElapsedTime() + 100;
  });

  const { updateBloom, updateField } = useZStore((state) => state);
  useEffect(() => {
    updateBloom({
      disable: true,
    });
    scene.traverse((child) => {
      if (child.type === "Mesh") {
        (child as Mesh).material = shader;
        // (child as Mesh).geometry.center();
      }
    });
    updateField({
      enableOrbit: true,
      showPlane: true,
    });
  }, []);

  const { viewport } = useThree();
  return (
    <>
      <mesh scale={2}>
        <primitive object={scene}></primitive>
      </mesh>
    </>
  );
};
