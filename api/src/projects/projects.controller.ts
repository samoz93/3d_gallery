import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { DbErrors } from '@samoz/utils';
import { IProject } from '@types';
import to from 'await-to-js';
import { ProjectsService } from './projects.service';

@Controller('projects')
export class ProjectsController {
  constructor(private service: ProjectsService) {}

  @Get()
  getProjects() {
    return this.service.getProjects();
  }

  @Post()
  async saveProjectInfo(@Body() body: IProject) {
    const [err, data] = await to(this.service.saveProjectInfo(body));
    if (err) {
      return err;
    }
    return data;
  }

  @Delete(':id')
  async removeProject(@Param('id') id: string) {
    const [err, data] = await to<IProject, DbErrors>(
      this.service.removeProject(id),
    );
    if (err) {
      throw err;
    }
    return data;
  }
}
