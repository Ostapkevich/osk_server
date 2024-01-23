import { Module } from '@nestjs/common';
import { ScanService } from './scan.service';
import { DrawingsController } from './drawings.controller';

@Module({
    providers: [ScanService],
    controllers: [DrawingsController]
  })
export class DrawingsModule {}
