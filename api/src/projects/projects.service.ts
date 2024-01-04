import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DbErrors } from '@samoz/utils';
import { IProject } from '@types';
import to from 'await-to-js';
import { Model } from 'mongoose';
import { Project } from './projects.schema';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name) private ProjectModel: Model<Project>,
  ) {}

  async getProjects() {
    const [err, projects] = await to(this.ProjectModel.find({}).exec());
    if (err) {
      throw new DbErrors('read', err);
    }
    return projects;
  }

  async saveProjectInfo(project: IProject) {
    const [err, newProject] = await to(new this.ProjectModel(project).save());
    if (err) {
      throw new DbErrors('save', err);
    }
    return newProject;
  }

  async removeProject(id: string) {
    const [err, data] = await to(
      this.ProjectModel.findByIdAndDelete(id).exec(),
    );

    if (err || !data) {
      throw new DbErrors('remove', err);
    }
    return data?.value.toObject<IProject>();
  }
}
