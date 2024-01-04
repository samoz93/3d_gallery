import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class Project {
  _id?: string;
  @Prop()
  projectName: string;
  @Prop()
  comp: string;
  @Prop()
  pth: string;
  @Prop({ type: Object })
  glsl: {
    vertexShader: string;
    fragmentShader: string;
  };
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
export type ProjectDocument = HydratedDocument<Project>;
