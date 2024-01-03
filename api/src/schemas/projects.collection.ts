// import { IProject } from '@types';
import { IProject } from '@types';
import mongoose from 'mongoose';

const Schema = new mongoose.Schema<IProject>({
  projectName: {
    type: String,
  },
  comp: String,
  pth: String,
  glsl: {
    vertexShader: String,
    fragmentShader: String,
  },
});

export const ProjectModel = mongoose.model<IProject>('projects', Schema);
