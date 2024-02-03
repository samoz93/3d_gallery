import {
  AudioVisScene,
  BrainScene,
  DancerScene,
  PlumbusSphereScene,
} from "@samoz/app/scene_components";
import { GoatScene } from "@samoz/app/scene_components/GoatScene";
import { WaterStreamScene } from "@samoz/app/scene_components/WaterStream";
import {
  audio_vis_frag,
  audio_vis_ver,
  brain_frag,
  brain_ver,
  dissolve_frag,
  dissolve_ver,
  plumbus_frag,
  plumbus_ver,
  vibrant_frag,
  vibrant_ver,
  water_frag,
  water_ver,
} from "@samoz/glsl";

type GlslData = {
  vertexShader: string;
  fragmentShader: string;
};

export const SceneData: {
  path: string;
  title: string;
  isDev?: boolean;
  comp: ({ glsl, props }: { glsl: GlslData; props?: any }) => JSX.Element;
  glsl: GlslData;
}[] = [
  {
    path: "DancerScene",
    title: "Dancer Scene",
    comp: DancerScene,
    glsl: {
      vertexShader: dissolve_ver,
      fragmentShader: dissolve_frag,
    },
  },
  {
    title: "Plumbus Sphere",
    comp: PlumbusSphereScene,
    path: "PlumbusSphere",
    glsl: {
      vertexShader: plumbus_ver,
      fragmentShader: plumbus_frag,
    },
  },
  {
    title: "Audio Visualizer",
    comp: AudioVisScene,
    path: "audio_vis",
    glsl: {
      vertexShader: audio_vis_ver,
      fragmentShader: audio_vis_frag,
    },
  },
  {
    title: "Golden Goat",
    comp: GoatScene,
    path: "golden_goat",
    glsl: {
      vertexShader: vibrant_ver,
      fragmentShader: vibrant_frag,
    },
  },
  {
    title: "Brain",
    comp: BrainScene,
    path: "brain_scene",
    glsl: {
      vertexShader: brain_ver,
      fragmentShader: brain_frag,
    },
  },
  {
    title: "Water Streams",
    comp: WaterStreamScene,
    path: "water_scene",
    glsl: {
      vertexShader: water_ver,
      fragmentShader: water_frag,
    },
  },
];
