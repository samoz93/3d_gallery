import { Controller, Get, Query } from '@nestjs/common';
import { Public } from '@samoz/utils/auth.roles';

@Controller()
@Public()
export class AppController {
  @Get()
  async getHello(@Query() body: any): Promise<any> {
    return 'hey';
  }
}
