import { Injectable } from '@nestjs/common';
import { ProjectModel } from '@samoz/schemas';
import { DbErrors } from '@samoz/utils';
import { IProject } from '@types';
import to from 'await-to-js';

@Injectable()
export class ProjectsService {
  constructor() {}

  async getProjects() {
    const [err, projects] = await to(ProjectModel.find({}).exec());
    if (err) {
      throw new DbErrors('read', err);
    }
    return projects;
  }

  async saveProjectInfo(project: IProject) {
    const [err, newProject] = await to(new ProjectModel(project).save());
    if (err) {
      throw new DbErrors('save', err);
    }
    return newProject;
  }

  async removeProject(id: string) {
    const [err, data] = await to(ProjectModel.findByIdAndDelete(id).exec());

    if (err || !data) {
      throw new DbErrors('remove', err);
    }
    return data?.value.toObject<IProject>();
  }
}
