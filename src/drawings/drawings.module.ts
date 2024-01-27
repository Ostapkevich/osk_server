import { Module } from '@nestjs/common';
import { ScanService } from './scan.service';
import { DrawingsController } from './drawings.controller';
import { AppService } from 'src/app.service';

@Module({
    providers: [AppService,ScanService],
    controllers: [DrawingsController]
  })
export class DrawingsModule {}
