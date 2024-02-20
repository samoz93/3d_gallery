"use client";

import { useFrame } from "@react-three/fiber";
import {
  sun_fbo_frag,
  sun_fbo_ver,
  sun_halo_frag,
  sun_halo_ver,
  sun_noise_frag,
  sun_noise_ver,
} from "@samoz/glsl";
import { useEffect, useMemo } from "react";
import {
  BackSide,
  CubeCamera,
  LinearMipmapLinearFilter,
  Mesh,
  RGBAFormat,
  SRGBColorSpace,
  Scene,
  ShaderMaterial,
  SphereGeometry,
  WebGLCubeRenderTarget,
} from "three";
import { useZStore } from "../stores/zStore";

const cTarget1 = new WebGLCubeRenderTarget(256, {
  format: RGBAFormat,
  generateMipmaps: true,
  minFilter: LinearMipmapLinearFilter,
  colorSpace: SRGBColorSpace,
});

const cCam1 = new CubeCamera(0.1, 10, cTarget1);
cCam1.position.set(0, 0, 0);
cCam1.lookAt(0, 0, 0);

const scene1 = new Scene();
const noiseShader = new ShaderMaterial({
  extensions: {
    derivatives: true,
  },
  vertexShader: sun_noise_ver,
  fragmentShader: sun_noise_frag,
  transparent: false,
  blending: 5,
  side: 2,

  uniforms: {
    uTime: { value: 0 },
  },
});

const geo = new SphereGeometry(0.9, 32, 32);
const mesh = new Mesh(geo, noiseShader);
scene1.add(mesh);

export const ScorchingSun = ({
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

  const materialSun = useMemo(() => {
    return new ShaderMaterial({
      vertexShader: sun_fbo_ver,
      fragmentShader: sun_fbo_frag,
      // blending: 5,
      side: 2,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: resolution },
        uTexture: { value: null },
      },
    });
  }, [glsl]);

  const haloShader = useMemo(() => {
    return new ShaderMaterial({
      vertexShader: sun_halo_ver,
      fragmentShader: sun_halo_frag,
      blending: 5,
      side: BackSide,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: resolution },
        uTexture: { value: null },
      },
    });
  }, []);

  useFrame(({ clock, gl, scene, camera }) => {
    const time = clock.getElapsedTime();
    noiseShader.uniforms.uTime.value = time;
    materialSun.uniforms.uTime.value = time;
    haloShader.uniforms.uTime.value = time;

    cCam1.update(gl, scene1);
    materialSun.uniforms.uTexture.value = cTarget1.texture;
  });

  const { updateBloom, updateField } = useZStore((state) => state);
  useEffect(() => {
    updateBloom({
      disable: true,
    });

    updateField({
      enableOrbit: false,
      showPlane: false,
      bgColor: "black",
    });
  }, []);

  return (
    <>
      {/* <mesh ref={ref} position={[0, 0, 0]} scale={1} material={perlinShader}>
        <sphereGeometry args={[1, 32, 32, 32]} />
      </mesh> */}
      <mesh rotation={[-0.2, 0, 0]} scale={3} material={haloShader}>
        <sphereGeometry args={[1, 32, 32]} />
      </mesh>
      <mesh position={[0, 0, 0]} material={materialSun} scale={2}>
        <sphereGeometry args={[1, 32, 32]} />
      </mesh>
    </>
  );
};
