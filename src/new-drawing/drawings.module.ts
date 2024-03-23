import { Module } from '@nestjs/common';
import { ScanService } from './scan.service';
import { CreateDrawingsController } from './createDrawings.controller';
import { AppService } from 'src/app.service';
import { DrawingService } from './drawing.service';

@Module({
    providers: [AppService,ScanService, DrawingService],
    controllers: [CreateDrawingsController]
  })
export class DrawingsModule {}
