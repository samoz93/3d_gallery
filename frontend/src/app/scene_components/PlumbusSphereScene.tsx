"use client";

import { UniformUpdater } from "@samoz/app/3d_components/UniformUpdater";
import { useMemo } from "react";
import {
  MeshDepthMaterial,
  MeshPhysicalMaterial,
  RGBADepthPacking,
} from "three";
import CustomShaderMaterial from "three-custom-shader-material/vanilla";

export const PlumbusSphereScene = ({
  glsl,
}: {
  children?: React.ReactNode;
  glsl: {
    vertexShader: string;
    fragmentShader: string;
  };
}) => {
  const material = useMemo(
    () =>
      new CustomShaderMaterial({
        baseMaterial: new MeshPhysicalMaterial({ color: "red" }),
        vertexShader: glsl.vertexShader,
        fragmentShader: glsl.fragmentShader,
        uniforms: {
          uRadius: { value: 1 },
          uTime: { value: 1 },
          uIntensity: { value: 1 },
          uProgress: { value: 1.1 },
        },
      }),
    []
  );

  const depthMaterial = useMemo(
    () =>
      new CustomShaderMaterial({
        baseMaterial: new MeshDepthMaterial({
          depthPacking: RGBADepthPacking,
          alphaTest: 0.1,
        }),
        vertexShader: glsl.vertexShader,
        fragmentShader: glsl.fragmentShader,
        uniforms: {
          uRadius: { value: 1 },
          uTime: { value: 1 },
          uIntensity: { value: 1 },
          uProgress: { value: 1.1 },
        },
      }),
    []
  );

  return (
    <UniformUpdater materials={[material, depthMaterial]} basicRotation>
      <mesh castShadow material={material} customDepthMaterial={depthMaterial}>
        <icosahedronGeometry args={[1, 100]} />
        {/* <meshBasicMaterial color={"red"}></meshBasicMaterial> */}
      </mesh>
    </UniformUpdater>
  );
};
