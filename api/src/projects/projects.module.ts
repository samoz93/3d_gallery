import { Module } from '@nestjs/common';
import { DbService } from '@samoz/services/db.service';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';

@Module({
  providers: [ProjectsService, DbService],
  controllers: [ProjectsController],
})
export class ProjectsModule {}
