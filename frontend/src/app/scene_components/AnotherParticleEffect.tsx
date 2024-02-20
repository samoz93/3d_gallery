"use client";

import { useGLTF } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { another_part_gpu_frag } from "@samoz/glsl";
import { useEffect, useMemo, useState } from "react";
import { Mesh, RepeatWrapping, ShaderMaterial } from "three";
import { GPUComputationRenderer } from "three/examples/jsm/misc/GPUComputationRenderer.js";
import { useZStore } from "../stores/zStore";
// const y = new GG();
// const n = y.parse(sun_fbo_frag);
// console.log(JSON.stringify(n, null, 2));
const width = 128;

export const AnotherParticleEffect = ({
  glsl,
}: {
  children?: React.ReactNode;
  glsl: {
    vertexShader: string;
    fragmentShader: string;
  };
}) => {
  const aspect = 1 / 2;

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

  const { gl } = useThree();
  const { scene } = useGLTF("/models/dancer.glb");
  console.log(scene);

  const gpu = useMemo(() => new GPUComputationRenderer(width, width, gl), [gl]);

  const posVariable = useMemo(() => {
    const tex = gpu.createTexture();

    const geo = (scene.getObjectByName("Object_4") as Mesh).geometry;
    const scale = 1;
    geo.scale(scale, scale, scale);
    geo.translate(0, 0, 0);

    const arr = tex.image.data;
    const geoArr = geo.attributes.position.array;
    const geoNumber = geoArr.length / 3;
    console.log("~~~", arr.length, width * width);

    for (let i = 0; i < arr.length; i += 4) {
      const rnd = Math.floor(i % geoNumber);
      const x = geoArr[rnd * 3];
      const y = geoArr[rnd * 3 + 1];
      const z = geoArr[rnd * 3 + 2];

      // const x = Math.random();
      // const y = Math.random();
      // const z = Math.random();

      arr[i] = x;
      arr[i + 1] = y;
      arr[i + 2] = z;
      arr[i + 3] = 1;
    }

    const variable = gpu.addVariable(
      "texturePosition",
      another_part_gpu_frag,
      tex
    );

    gpu.setVariableDependencies(variable, [variable]);
    // variable.dependencies = [variable];
    variable.wrapS = RepeatWrapping;
    variable.wrapT = RepeatWrapping;
    return variable;
  }, [scene, gpu]);

  const shader = useMemo(() => {
    return new ShaderMaterial({
      vertexShader: glsl.vertexShader,
      fragmentShader: glsl.fragmentShader,
      // blending: 5,
      side: 2,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: resolution },
        uTexture: { value: null },
      },
    });
  }, [glsl, resolution]);

  const [vr, setVr] = useState({});
  useFrame(({ clock, gl, scene, camera }) => {
    const time = clock.getElapsedTime();
    shader.uniforms.uTime.value = time;
    // posVariable!.material.uniforms.uTime = { value: time };

    // gpu.compute();
    // shader.uniforms.uTexture.value =
    //   gpu.getCurrentRenderTarget(posVariable).texture;
  });

  const { ref, pos } = useMemo(() => {
    const pos = new Float32Array(width * width * 3);
    const ref = new Float32Array(width * width * 2);
    for (let i = 0; i < width * width; i++) {
      const x = Math.random();
      const y = Math.random();
      const z = Math.random();
      const xx = (i % width) / width;
      const yy = ~~(i / width) / width;

      pos.set([x, y, z], i * 3);
      ref.set([xx, yy], i * 2);
    }

    return { pos, ref };
  }, []);

  const { updateBloom, updateField } = useZStore((state) => state);
  const geo = (scene.getObjectByName("Object_4") as Mesh).geometry;

  useEffect(() => {
    // setVr(posVariable);
    geo.scale(0.006, 0.006, 0.006);

    // const error = gpu.init();

    // if (error !== null) {
    //   console.error(error);
    // }

    updateBloom({
      disable: true,
    });

    updateField({
      enableOrbit: true,
      showPlane: false,
      bgColor: "#000000",
    });
  }, []);

  return (
    <>
      <points position={[0, 0, 0]} material={shader} scale={2} geometry={geo}>
        {/* <icosahedronGeometry args={[1, 34]} /> */}
      </points>
    </>
  );
};
