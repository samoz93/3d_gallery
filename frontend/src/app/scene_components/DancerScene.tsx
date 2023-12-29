"use client";

import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { UniformUpdater } from "@samoz/app/3d_components/UniformUpdater";
import { updateGeometryIndexes } from "@samoz/tools";
import { useControls } from "leva";
import { useEffect, useMemo, useRef } from "react";
import {
  Group,
  MathUtils,
  Mesh,
  MeshDepthMaterial,
  MeshPhysicalMaterial,
  RGBADepthPacking,
} from "three";
import CustomShaderMaterial from "three-custom-shader-material/vanilla";

export const DancerScene = ({
  children,
  glsl,
}: {
  children?: React.ReactNode;
  glsl: {
    vertexShader: string;
    fragmentShader: string;
  };
}) => {
  const { scene } = useGLTF("/models/dancer.glb", true);

  const baseMaterial = useMemo(
    () =>
      new MeshPhysicalMaterial({
        emissive: 0.1,
        roughness: 0.2,
        depthWrite: true,
        color: "blue",
      }),
    []
  );

  const material = useMemo(
    () =>
      new CustomShaderMaterial({
        baseMaterial,
        vertexShader: glsl.vertexShader,
        fragmentShader: glsl.fragmentShader,
        uniforms: {
          uProgress: { value: 0 },
          uIntensity: { value: 1 },
          uTime: { value: 0 },
        },
      }),
    [baseMaterial]
  );

  const depthMaterial = useMemo(
    () =>
      new CustomShaderMaterial({
        baseMaterial: new MeshDepthMaterial({
          depthPacking: RGBADepthPacking,
          alphaTest: 0.2,
        }),
        vertexShader: glsl.vertexShader,
        fragmentShader: glsl.fragmentShader,
        uniforms: {
          uProgress: { value: 0 },
          uIntensity: { value: 1 },
          uTime: { value: 0 },
        },
      }),
    []
  );

  const { roughness, emission } = useControls({
    roughness: { value: 0.4, min: 0, max: 1, step: 0.01 },
    emission: { value: 0.2, min: 0, max: 1, step: 0.01 },
  });

  useEffect(() => {
    //@ts-ignore
    material.roughness = roughness;
  }, [roughness]);

  const dancerData = useMemo(() => {
    const dancer = new Group();
    scene?.traverse((obj) => {
      if (obj.type === "Mesh") {
        const newObj = obj.clone() as Mesh;

        newObj.geometry = updateGeometryIndexes(newObj.geometry);
        newObj.material = material;
        newObj.material.needsUpdate = true;
        newObj.customDepthMaterial = depthMaterial;
        newObj.customDepthMaterial.needsUpdate = true;

        newObj.castShadow = true;
        const scale = 0.01;
        newObj.scale.multiplyScalar(scale);
        dancer.add(newObj);
      }
    });
    return dancer;
  }, [scene, material, depthMaterial]);

  useFrame(({ clock }) => {
    const progress = MathUtils.lerp(
      Math.max(Math.sin(clock.getElapsedTime() * 0.3), 0.3),
      1,
      Math.max(Math.cos(clock.getElapsedTime() * 0.1), 0.3)
    );
    material.uniforms.uProgress.value = progress;
    depthMaterial.uniforms.uProgress.value = progress;

    if (ref.current) {
      ref.current.rotation.y += 0.01;
    }
  });

  const ref = useRef<Mesh>();

  return (
    <UniformUpdater materials={[material, depthMaterial]} basicRotation>
      <primitive ref={ref} object={dancerData} />
    </UniformUpdater>
  );
};
