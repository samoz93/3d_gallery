"use client";

import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import {
  water_bg_frag,
  water_bg_ver,
  water_tube_frag,
  water_tube_ver,
} from "@samoz/glsl";
import { useControls } from "leva";
import { useEffect, useMemo } from "react";
import {
  BufferAttribute,
  BufferGeometry,
  CatmullRomCurve3,
  Color,
  ShaderMaterial,
  Texture,
  TubeGeometry,
  Vector3,
} from "three";
import { useZStore } from "../stores/zStore";

const getGeometry = (count: number) => {
  const geo = new BufferGeometry();
  const positions = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const randoms = new Float32Array(count * 3);

  for (let i = 0; i < count * 3; i += 3) {
    positions[i + 0] = Math.random() - 0.5;
    positions[i + 1] = Math.random() - 0.5;
    positions[i + 2] = Math.random() - 0.5;

    sizes[i] = Math.random() * 0.5 + 0.5;

    randoms[i] = Math.random();
    randoms[i + 1] = Math.random();
    randoms[i + 2] = Math.random();
  }
  geo.setAttribute("position", new BufferAttribute(positions, 3));
  geo.setAttribute("size", new BufferAttribute(sizes, 1));
  geo.setAttribute("aRandom", new BufferAttribute(randoms, 3));
  return geo;
};

const { sin, cos } = Math;
const getTubeGeo = (count: number) => {
  const points = new Array(count).fill(0).map((_, i) => {
    let angle = Math.PI * 2 * (i / count);
    return new Vector3(
      sin(angle) + 2 * sin(2 * angle),
      cos(angle) - 2 * cos(2 * angle),
      -sin(angle * 3)
    );
  });
  const curve = new CatmullRomCurve3(points);
  return new TubeGeometry(curve, count, 0.5, 100, true);
};
export const WaterStreamScene = ({
  glsl,
}: {
  children?: React.ReactNode;
  glsl: {
    vertexShader: string;
    fragmentShader: string;
  };
}) => {
  useControls({
    speed: {
      value: 0.8,
      min: 0,
      max: 10,
      onChange: (value) => {
        shader.uniforms.uSpeed.value = value;
        backgroundMaterial.uniforms.uSpeed.value = value;
        tubeShader.uniforms.uSpeed.value = value;
      },
    },
  });

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
        uColor: { value: new Color("blue") },
        uTexture: { value: null },
        uTime: { value: 0 },
        uSpeed: { value: 0.8 },
      },
    });
  }, [glsl]);

  const tubeShader = useMemo(() => {
    return new ShaderMaterial({
      vertexShader: water_tube_ver,
      fragmentShader: water_tube_frag,
      transparent: true,
      uniforms: {
        uColor: { value: new Color("blue") },
        uWaterTexture: { value: new Texture() },
        uTexture: { value: new Texture() },
        uTime: { value: 0 },
        uSpeed: { value: 0.8 },
      },
    });
  }, []);

  const backgroundMaterial = useMemo(() => {
    return new ShaderMaterial({
      vertexShader: water_bg_ver,
      fragmentShader: water_bg_frag,
      transparent: true,
      uniforms: {
        uTexture: { value: new Texture() },
        uTime: { value: 0 },
        uSpeed: { value: 0.8 },
      },
    });
  }, []);

  useFrame(({ clock }) => {
    shader.uniforms.uTime.value = clock.getElapsedTime() + 100;
    tubeShader.uniforms.uTime.value = clock.getElapsedTime() + 100;
    backgroundMaterial.uniforms.uTime.value = clock.getElapsedTime() + 100;
  });

  useTexture("../../textures/img.png", (texture) => {
    shader.uniforms.uTexture.value = texture;
  });

  useTexture("../../textures/dust.webp", (texture) => {
    tubeShader.uniforms.uTexture.value = texture;
  });
  useTexture("../../textures/water_alpha.jpeg", (texture) => {
    tubeShader.uniforms.uWaterTexture.value = texture;
  });

  useTexture("../../textures/noise.jpg", (texture) => {
    backgroundMaterial.uniforms.uTexture.value = texture;
  });

  const count = 200;
  const geometry = useMemo(() => {
    return getGeometry(count);
  }, [count]);

  const geometryTube = useMemo(() => {
    return getTubeGeo(100);
  }, []);

  const update = useZStore((state) => state);
  useEffect(() => {
    update.updateBloom({
      disable: true,
      intensity: 0,
      smoothing: 0,
      threshold: 0,
    });
    update.updateField({ showPlane: false, enableOrbit: true });

    return () => {
      update.restoreDefault();
    };
  }, []);
  return (
    <group scale={1} position={[0, 0, -1]}>
      <points material={shader} geometry={geometry}></points>
      <mesh
        position={[0, 0, 0]}
        geometry={geometryTube}
        material={tubeShader}
      />
      <mesh position={[0, 0, -5]} material={backgroundMaterial}>
        <planeGeometry args={[50, 50]} />
      </mesh>
    </group>
  );
};
