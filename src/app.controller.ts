import { Controller, Get, Res } from '@nestjs/common';

import { AppService } from './app.service';
import { Response } from 'express';
import { join } from 'path';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/')
  getHello(@Res() response: Response): void {
    return response.sendFile(join(__dirname, '../oskmanager', 'index.html'));
  }
}
