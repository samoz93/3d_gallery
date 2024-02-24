import {
  AnotherParticleEffect,
  AudioVisScene,
  DancerScene,
  FancyScroll,
  FollowTheLine,
  PlayfulChildren,
  PlumbusSphereScene,
  RayMarchingScene,
  ScorchingSun,
  TubesScene,
} from "@samoz/app/scene_components";
import { GoatScene } from "@samoz/app/scene_components/GoatScene";
import { ScreenSaverScene } from "@samoz/app/scene_components/ScreenSaverScene";
import { ScrollTransitionScene } from "@samoz/app/scene_components/ScrollTransitionScene";
import { WaterStreamScene } from "@samoz/app/scene_components/WaterStream";
import {
  another_part_frag,
  another_part_ver,
  audio_vis_frag,
  audio_vis_ver,
  bg_tube_frag,
  bg_tube_ver,
  dissolve_frag,
  dissolve_ver,
  electric_frag,
  electric_ver,
  fancy_scroll_frag,
  fancy_scroll_ver,
  playful_frag,
  plumbus_frag,
  plumbus_ver,
  raymarch_frag,
  raymarch_ver,
  screen_saver_frag,
  screen_saver_ver,
  scroll_transition_frag,
  scroll_transition_ver,
  sun_noise_frag,
  sun_noise_ver,
  vibrant_frag,
  vibrant_ver,
  water_frag,
  water_ver,
} from "@samoz/glsl";

type GlslData = {
  vertexShader: string;
  fragmentShader: string;
};

export type ISceneData = {
  path: string;
  title: string;
  isDev?: boolean;
  disableThreeJs?: boolean;
  comp: ({ glsl, props }: { glsl: GlslData; props?: any }) => JSX.Element;
  glsl: GlslData;
};

export const SceneData: ISceneData[] = [
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
  // {
  //   title: "Brain",
  //   comp: BrainScene,
  //   path: "brain_scene",
  //   glsl: {
  //     vertexShader: brain_ver,
  //     fragmentShader: brain_frag,
  //   },
  // },
  {
    title: "Water Streams",
    comp: WaterStreamScene,
    path: "water_scene",
    glsl: {
      vertexShader: water_ver,
      fragmentShader: water_frag,
    },
  },
  {
    title: "Playfulness",
    comp: PlayfulChildren,
    path: "playful_children",
    glsl: {
      vertexShader: raymarch_ver,
      fragmentShader: playful_frag,
    },
  },
  {
    title: "Ray Marching",
    comp: RayMarchingScene,
    path: "ray_marching",
    glsl: {
      vertexShader: raymarch_ver,
      fragmentShader: raymarch_frag,
    },
  },
  {
    title: "Screen Saver",
    comp: ScreenSaverScene,
    path: "screen_saver",
    glsl: {
      vertexShader: screen_saver_ver,
      fragmentShader: screen_saver_frag,
    },
  },
  {
    title: "Fancy Scroll",
    comp: FancyScroll,
    path: "fancy_scroll",
    isDev: true,
    glsl: {
      vertexShader: fancy_scroll_ver,
      fragmentShader: fancy_scroll_frag,
    },
  },
  {
    title: "Sunny Day",
    comp: ScorchingSun,
    path: "sun",
    glsl: {
      vertexShader: sun_noise_ver,
      fragmentShader: sun_noise_frag,
    },
  },
  {
    title: "Another one",
    comp: AnotherParticleEffect,
    path: "another_one",
    isDev: true,
    glsl: {
      vertexShader: another_part_ver,
      fragmentShader: another_part_frag,
    },
  },
  {
    title: "Electric Fence",
    comp: FollowTheLine,
    path: "electric_fence",
    isDev: true,
    glsl: {
      vertexShader: electric_ver,
      fragmentShader: electric_frag,
    },
  },
  {
    title: "Out Of Ideas",
    comp: TubesScene,
    path: "bg_curves",
    glsl: {
      vertexShader: bg_tube_ver,
      fragmentShader: bg_tube_frag,
    },
  },
  {
    title: "Sweet",
    comp: ScrollTransitionScene,
    path: "sweat",
    disableThreeJs: true,
    glsl: {
      vertexShader: scroll_transition_ver,
      fragmentShader: scroll_transition_frag,
    },
  },
];
