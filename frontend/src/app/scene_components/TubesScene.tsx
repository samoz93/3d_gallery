"use client";

import { useFrame } from "@react-three/fiber";
import { bg_tube_frag, bg_tube_plan_frag, bg_tube_ver } from "@samoz/glsl";
import { useEffect, useMemo, useRef } from "react";
import { createNoise3D } from "simplex-noise";
import {
  CatmullRomCurve3,
  Mesh,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  Vector3,
} from "three";
import { useZStore } from "../stores/zStore";

const noise = createNoise3D();
const vec1 = new Vector3();
const vec2 = new Vector3();

const temp = new Vector3();
const bouncy = new Vector3();
const elasticMouse = new Vector3();
const mouse = new Vector3();

const scene1 = new Scene();
const geo = new PlaneGeometry(100, 100);
const bgMaterial = new ShaderMaterial({
  vertexShader: bg_tube_ver,
  fragmentShader: bg_tube_plan_frag,
  uniforms: {
    uTime: { value: 0 },
    uLight: { value: new Vector3(0, 0, 0) },
  },
});
const bgMesh = new Mesh(geo, bgMaterial);
scene1.add(bgMesh);

function computeCurl(x: number, y: number, z: number) {
  var eps = 1e-4;

  //Find rate of change in X
  var n1 = noise(x + eps, y, z);
  var n2 = noise(x - eps, y, z);
  //Average to find approximate derivative
  var a = (n1 - n2) / (2 * eps);

  //Find rate of change in Y
  n1 = noise(x, y + eps, z);
  n2 = noise(x, y - eps, z);
  //Average to find approximate derivative
  var b = (n1 - n2) / (2 * eps);

  //Find rate of change in Z
  n1 = noise(x, y, z + eps);
  n2 = noise(x, y, z - eps);
  //Average to find approximate derivative
  var c = (n1 - n2) / (2 * eps);

  var noiseGrad0 = vec1.set(a, b, c);

  // Offset position for second noise read
  x += 10000.5;
  y += 10000.5;
  z += 10000.5;

  //Find rate of change in X
  n1 = noise(x + eps, y, z);
  n2 = noise(x - eps, y, z);
  //Average to find approximate derivative
  a = (n1 - n2) / (2 * eps);

  //Find rate of change in Y
  n1 = noise(x, y + eps, z);
  n2 = noise(x, y - eps, z);
  //Average to find approximate derivative
  b = (n1 - n2) / (2 * eps);

  //Find rate of change in Z
  n1 = noise(x, y, z + eps);
  n2 = noise(x, y, z - eps);
  //Average to find approximate derivative
  c = (n1 - n2) / (2 * eps);

  var noiseGrad1 = vec2.set(a, b, c);

  noiseGrad1 = noiseGrad1.normalize();
  noiseGrad1 = noiseGrad1.normalize();
  var curl = noiseGrad1.cross(noiseGrad0);
  return curl.normalize();
}

const randomColor = () =>
  "#" + Math.floor(Math.random() * 16777215).toString(16);

const getCurves = (count: number, start: Vector3) => {
  const points = [];
  points.push(start);
  let currentPoints = start.clone();

  for (let i = 0; i < count; i++) {
    const curl = computeCurl(
      currentPoints.x,
      currentPoints.y,
      currentPoints.z
    ).multiplyScalar(0.009);

    currentPoints.add(curl);

    points.push(currentPoints.clone());
  }

  return new CatmullRomCurve3(points, false);
};
export const TubesScene = ({
  children,
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
      new ShaderMaterial({
        vertexShader: bg_tube_ver,
        fragmentShader: bg_tube_frag,
        uniforms: {
          uTime: { value: 0 },
          uLight: { value: new Vector3(0, 0, 0) },
        },
      }),
    []
  );

  useFrame(({ clock, gl, scene }) => {
    material.uniforms.uTime.value = clock.getElapsedTime();
    temp.copy(mouse).sub(elasticMouse).multiplyScalar(0.1);
    bouncy.add(temp).multiplyScalar(0.8);
    elasticMouse.add(bouncy);
    boxRef.current!.position.copy(elasticMouse);
    material.uniforms.uLight.value = elasticMouse;
    bgMaterial.uniforms.uLight.value = elasticMouse;
  });

  const { updateField, updateBloom } = useZStore();

  useEffect(() => {
    updateField({
      showPlane: false,
      bgColor: "#000000",
      enableOrbit: true,
      // enableLights: false,
    });
    updateBloom({
      disable: false,
      intensity: 7,
      smoothing: 0.3,
      threshold: 0,
    });
  }, []);

  const curvesCount = 300;
  const pointsCount = 100;
  const curves = useMemo(() => {
    return new Array(curvesCount).fill(0).map((_, i) => {
      const rnd = Math.random();
      const rnd2 = Math.random();
      const rnd3 = Math.random();
      return getCurves(
        pointsCount,
        new Vector3(rnd - 0.5, rnd2 - 0.5, rnd3 - 0.2)
      );
    });
  }, [curvesCount]);

  const boxRef = useRef<Mesh>(null);

  return (
    <>
      <mesh
        material={bgMaterial}
        onPointerMove={(e) => {
          e.point.z += 0.5;
          mouse.copy(e.point);
          // boxRef.current!.position.copy(e.point);
        }}
      >
        <planeGeometry args={[100, 100]} />
      </mesh>
      <mesh ref={boxRef}>
        <sphereGeometry args={[0.03, 10, 10]} />
        <meshBasicMaterial color={"white"} />
        {/* <pointLight intensity={1} color={"red"} /> */}
        <pointLight
          color={"red"}
          // distance={100}
          intensity={1}
          position={[0, 0, 0]}
        ></pointLight>
      </mesh>

      {curves.map((curve, i) => {
        return (
          <mesh
            position={[0, 0, 2]}
            castShadow
            scale={3}
            key={i}
            material={material}
          >
            <tubeGeometry args={[curve, 100, 0.002, 10, false]} />
          </mesh>
        );
      })}
    </>
  );
};
