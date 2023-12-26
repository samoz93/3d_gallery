import {
  audio_vis_frag,
  audio_vis_ver,
  dissolve_frag,
  dissolve_ver,
  plumbus_frag,
  plumbus_ver,
} from "@samoz/glsl";
import { AudioVis, DancerScene, PlumbusSphere } from "@samoz/scenes";

export const SceneData = [
  {
    key: "DancerScene",
    value: "Dancer Scene",
    comp: DancerScene,
    path: "dancer-scene",
    glsl: {
      vertexShader: dissolve_ver,
      fragmentShader: dissolve_frag,
    },
  },
  {
    key: "PlumbusSphere",
    value: "Plumbus Sphere",
    comp: PlumbusSphere,
    path: "PlumbusSphere",
    glsl: {
      vertexShader: plumbus_ver,
      fragmentShader: plumbus_frag,
    },
  },
  {
    key: "AudioVisualizer",
    value: "Audio Visualizer",
    comp: AudioVis,
    path: "AudioVisualizer",
    glsl: {
      vertexShader: audio_vis_ver,
      fragmentShader: audio_vis_frag,
    },
  },
];
