import { Document } from 'mongoose';

export interface IProject {
  projectName: string;
  comp: string;
  pth: string;
  glsl: {
    vertexShader: string;
    fragmentShader: string;
  };
}

export type IDoc<T> = T & Document;
