import { Controller, Get } from '@nestjs/common';
import { DbService } from 'src/services/db.service';

@Controller()
export class AppController {
  constructor(private db: DbService) {
    console.log('Hello', process.env);
  }

  @Get()
  getHello(): any {
    return 'HEllo';
  }
}
