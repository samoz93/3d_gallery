import { useFrame, useThree } from "@react-three/fiber";
import { scroll_transition_frag, scroll_transition_ver } from "@samoz/glsl";
import { useWheel } from "@use-gesture/react";
import { Lethargy } from "lethargy";
import { useControls } from "leva";
import { useEffect, useMemo, useRef } from "react";
import {
  BoxGeometry,
  BufferGeometry,
  Color,
  Mesh,
  MeshMatcapMaterial,
  MirroredRepeatWrapping,
  OrthographicCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  SphereGeometry,
  TextureLoader,
  Vector3,
  WebGLRenderTarget,
} from "three";
import { useZStore } from "../stores/zStore";
const loader = new TextureLoader();
const positions = Array.from({ length: 100 }).map(() => {
  return new Vector3().randomDirection().multiplyScalar(1);
});
const getScene = (
  matcap = "1",
  bg = "gray",
  geo: BufferGeometry = new SphereGeometry(0.5, 32, 32)
) => {
  const mtMaterial = new MeshMatcapMaterial({
    matcap: loader.load(`/textures/matcap/${matcap}.png`),
    side: 2,
  });

  const mesh = new Mesh(geo, mtMaterial);
  mesh.scale.set(0.4, 0.4, 0.4);
  const scene = new Scene();
  scene.background = new Color(bg);

  positions.forEach((rnd) => {
    const m = mesh.clone();
    m.position.copy(rnd);
    scene.add(m);
  });
  const target = new WebGLRenderTarget(window.innerWidth, window.innerHeight, {
    wrapS: MirroredRepeatWrapping,
    wrapT: MirroredRepeatWrapping,
  });
  return { scene, target };
};

const lethargy = new Lethargy();

export const ScrollTransitionCom = ({
  glsl,
  matcap,
  bg,
}: {
  matcap?: string;
  bg?: string;
  glsl: {
    vertexShader: string;
    fragmentShader: string;
  };
}) => {
  const material = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: scroll_transition_ver,
        fragmentShader: scroll_transition_frag,
        uniforms: {
          uTime: { value: 0 },
          uTexture1: { value: loader.load("/textures/matcap/1.png") },
          uTexture2: { value: loader.load("/textures/matcap/2.png") },
          uTexture3: { value: loader.load("/textures/matcap/3.png") },
          uProgress: { value: 0 },
        },
      }),
    []
  );

  useControls("Sweat", {
    progress: {
      value: 0,
      min: 0,
      max: 1,
      step: 0.01,
      onChange: (v) => {
        material.uniforms.uProgress.value = v;
      },
    },
  });

  const aspect = 1;

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

  const {
    scene: postScene,
    mesh,
    camera: postCamera,
  } = useMemo(() => {
    const scene = new Scene();
    const geo = new PlaneGeometry(1, 1, 1);
    const mesh = new Mesh(geo, material);
    const frustumSize = 1;

    const camera = new OrthographicCamera(
      (frustumSize * aspect) / -2,
      (frustumSize * aspect) / 2,
      frustumSize / 2,
      frustumSize / -2,
      -1000,
      1000
    );

    scene.add(mesh);
    return { scene, mesh, camera };
  }, []);
  const scenes = useMemo(() => {
    const scene1 = getScene("1", "green");
    const scene2 = getScene("2", "blue");
    const scene3 = getScene("3", "red", new BoxGeometry(0.5, 0.5, 0.5));
    return [scene1, scene2, scene3];
  }, []);

  useFrame(({ clock, gl, scene, camera }) => {
    material.uniforms.uTime.value = clock.getElapsedTime();

    const current = Math.floor(ref.current % scenes.length);
    const next = (current + 1) % scenes.length;

    let sc = scenes[current];
    gl.setRenderTarget(sc.target);
    gl.render(sc.scene, camera);
    material.uniforms.uTexture1.value = sc.target.texture;

    sc = scenes[next];
    gl.setRenderTarget(sc.target);
    gl.render(sc.scene, camera);
    material.uniforms.uTexture2.value = sc.target.texture;

    scenes.forEach((s) => {
      s.scene.rotation.y = clock.getElapsedTime() * 0.1;
    });

    gl.setRenderTarget(null);
    gl.render(postScene, postCamera);
  });

  const { updateBloom, updateField } = useZStore((st) => st);
  const { gl, camera } = useThree();
  useEffect(() => {
    updateField({
      showPlane: false,
      enableOrbit: false,
      bgColor: "transparent",
    });
    updateBloom({
      disable: true,
    });

    scenes.forEach((s) => {
      gl.compile(s.scene, camera);
    });
  }, []);

  const ref = useRef(0);
  useWheel(
    ({ event, last, memo: wait = true, delta }) => {
      if (last) return;
      event.preventDefault();
      if (lethargy.check(event)) {
        console.log("event", lethargy.check(event));
      }
      ref.current += delta[1] * 0.001;
      material.uniforms.uProgress.value = ref.current % 1;
      console.log(
        "ref.current",
        material.uniforms.uProgress.value,
        ref.current
      );

      if (ref.current < 0) ref.current = scenes.length - 1;
    },
    {
      enabled: true,
      target: window,
      eventOptions: {
        passive: false,
      },
    }
  );

  return <></>;
};
