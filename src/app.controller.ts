import { Controller, Get, Res } from '@nestjs/common';

//import { AppService } from './app.service';
import { Response } from 'express';
import { join } from 'path';

@Controller()
export class AppController {
  constructor() {}

  @Get('/')
  returnAppClient(@Res() response: Response): void {
    return response.sendFile(join(__dirname, '../oskmanager', 'index.html'));
  }
}
