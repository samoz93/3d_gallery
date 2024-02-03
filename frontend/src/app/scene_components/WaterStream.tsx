"use client";

import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { water_tube_frag, water_tube_ver } from "@samoz/glsl";
import { useControls } from "leva";
import { useMemo } from "react";
import {
  BufferAttribute,
  BufferGeometry,
  CatmullRomCurve3,
  Color,
  ShaderMaterial,
  TubeGeometry,
  Vector2,
  Vector3,
} from "three";

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
  return new TubeGeometry(curve, count, 0.1, 100, true);
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
      value: 3,
      min: 0,
      max: 10,
      onChange: (value) => {
        uniforms.uSpeed.value = value;
      },
    },
  });
  const uniforms = useMemo(() => {
    return {
      uTime: { value: 0 },
      uSpeed: { value: 3 },
      uTexture: { value: null },
      uMouse: {
        value: new Vector2(0, 0),
      },
    };
  }, []);
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
        ...uniforms,
      },
    });
  }, [glsl]);

  const tubeShader = useMemo(() => {
    return new ShaderMaterial({
      vertexShader: water_tube_ver,
      fragmentShader: water_tube_frag,
      uniforms: {
        uColor: { value: new Color("blue") },
        uWaterTexture: { value: null },

        ...uniforms,
      },
    });
  }, [glsl]);

  useFrame(({ clock, pointer }) => {
    shader.uniforms.uTime.value = clock.getElapsedTime();
    tubeShader.uniforms.uTime.value = clock.getElapsedTime();
  });
  useTexture("../../textures/img.png", (texture) => {
    tubeShader.uniforms.uTexture.value = texture;
  });

  useTexture("../../textures/dust.webp", (texture) => {
    tubeShader.uniforms.uTexture.value = texture;
  });
  useTexture("../../textures/water_alpha.jpeg", (texture) => {
    tubeShader.uniforms.uWaterTexture.value = texture;
  });

  const count = 10000;
  const geometry = useMemo(() => {
    return getGeometry(count);
  }, [count]);

  const geometryTube = useMemo(() => {
    return getTubeGeo(100);
  }, [count]);
  return (
    <group position={[0, 8, 0]}>
      <points scale={3} material={shader} geometry={geometry}></points>
      <mesh
        scale={3}
        position={[0, 0, 0]}
        geometry={geometryTube}
        material={tubeShader}
      />
    </group>
  );
};
