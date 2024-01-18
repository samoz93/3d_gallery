export interface IProject {
  projectName: string;
  comp: string;
  pth: string;
  glsl: {
    vertexShader: string;
    fragmentShader: string;
  };
}
