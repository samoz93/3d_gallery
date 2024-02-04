"use client";

import { useFrame } from "@react-three/fiber";
import { brainData } from "@samoz/data";
import { brain_particles_frag, brain_particles_ver } from "@samoz/glsl";
import { useControls } from "leva";
import { useMemo, useState } from "react";
import {
  AdditiveBlending,
  CatmullRomCurve3,
  Color,
  ShaderMaterial,
  Vector2,
  Vector3,
} from "three";

type IShape = keyof typeof brainData;
const scale = 9;

const getPaths = (shape: IShape): any[] => {
  return (brainData[shape]! as any)[0].paths;
};

const getBrainCurves = (shape: IShape) => {
  const curves: CatmullRomCurve3[] = [];
  getPaths(shape).forEach((item: any) => {
    const path = [];
    for (let i = 0; i < item.length; i = i + 3) {
      path.push(new Vector3(item[i], item[i + 1], item[i + 2]));
    }
    curves.push(new CatmullRomCurve3(path, false, "catmullrom"));
  });
  return curves;
};

// const getCurves = (count: number) => {
//   let curves = [];
//   for (let i = 0; i < count; i++) {
//     const length = randomeRange(0.1, 0.8);
//     const length2 = randomeRange(0.1, 0.8);
//     let points = [];
//     for (let j = 0; j < count; j++) {
//       points.push(
//         new Vector3().setFromSphericalCoords(
//           2 * length2,
//           Math.PI - Math.PI * (j / count) * length,
//           Math.PI * 2 * (i / count)
//         )
//       );
//     }
//     curves.push(new CatmullRomCurve3(points, false, "catmullrom"));
//   }
//   return curves;
// };

const BrainTube = ({
  curve,
  shader,
}: {
  curve: CatmullRomCurve3;
  shader: ShaderMaterial;
}) => {
  return (
    <mesh scale={scale} material={shader}>
      <tubeGeometry args={[curve, 100, 0.001, 32, false]} />
    </mesh>
  );
};

const BrainParticles = ({
  curves,
  shader,
  shape,
}: {
  curves: CatmullRomCurve3[];
  shader: ShaderMaterial;
  shape: IShape;
}) => {
  const arr = useMemo(() => {
    const all = getPaths(shape)
      .slice(2)
      .reduce((acc, item) => {
        return [...acc, ...item];
      }, []);
    return Float32Array.from(all);
  }, []);

  console.log(arr.length);

  return (
    <points scale={scale} material={shader}>
      <bufferGeometry attach="geometry">
        <bufferAttribute
          attach={"attributes-position"}
          count={arr.length / 3}
          array={arr}
          itemSize={3}
        />
      </bufferGeometry>
    </points>
  );
};
export const BrainScene = ({
  glsl,
}: {
  children?: React.ReactNode;
  glsl: {
    vertexShader: string;
    fragmentShader: string;
  };
}) => {
  const [shape, setShape] = useState<IShape>("engineering");
  useControls({
    object: {
      options: Object.keys(brainData),
      value: "economics",
      onChange: (value) => {
        setShape(value as IShape);
      },
    },
    speed: {
      value: 2,
      min: 0,
      max: 10,
      onChange: (value) => {
        uniforms.uSpeed.value = value;
      },
    },
    segment: {
      value: 34,
      min: 0,
      max: 100,
      onChange: (value) => {
        uniforms.uSegment.value = value;
      },
    },
    xy: {
      value: [1.8, 0.2],
      onChange: (value) => {
        uniforms.uX.value = value[0];
        uniforms.uY.value = value[1];
      },
    },
  });
  const uniforms = useMemo(() => {
    return {
      uSegment: { value: 30 },
      uTime: { value: 0 },
      uSpeed: { value: 3 },
      uX: { value: 1 },
      uY: { value: 1 },
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
      wireframe: true,
      // blendAlpha: 0.5,
      blending: 5,
      uniforms: {
        uColor: { value: new Color("blue") },
        ...uniforms,
      },
    });
  }, [glsl]);

  const particleShader = useMemo(() => {
    return new ShaderMaterial({
      vertexShader: brain_particles_ver,
      fragmentShader: brain_particles_frag,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      wireframe: true,
      // blendAlpha: 0.5,
      blending: AdditiveBlending,
      uniforms: {
        uColor: { value: new Color("red") },
        ...uniforms,
      },
    });
  }, []);

  const curves = useMemo(() => {
    return getBrainCurves(shape);
  }, [shape]);

  useFrame(({ clock, pointer }) => {
    shader.uniforms.uTime.value = clock.getElapsedTime();
    particleShader.uniforms.uTime.value = clock.getElapsedTime();
    particleShader.uniforms.uMouse.value.x = pointer.x;
    particleShader.uniforms.uMouse.value.y = pointer.y;
    shader.uniforms.uMouse.value.x = pointer.x;
    shader.uniforms.uMouse.value.y = pointer.y;
  });
  return (
    <group scale={2}>
      {curves.map((curve, i) => {
        return <BrainTube shader={shader} key={i.toString()} curve={curve} />;
      })}
      <BrainParticles
        key={shape}
        shape={shape}
        shader={particleShader}
        curves={curves}
      />
    </group>
  );
};
