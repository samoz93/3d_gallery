import { Controller, Get, Query, StreamableFile } from '@nestjs/common';
import { Public } from '@samoz/utils/auth.roles';
import { createReadStream } from 'fs';
import { join } from 'path';

@Controller()
@Public()
export class AppController {
  @Get()
  async getHello(@Query() body: any): Promise<any> {
    console.log('body', body);
    const path = join(process.cwd(), 'src', 'glsl', 'audio_vis_2_frag.glsl');
    const file = createReadStream(path);
    return new StreamableFile(file, {
      disposition: 'inline',
    });
  }
}
