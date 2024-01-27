import { Module } from '@nestjs/common';
import { ViewDrawingsController } from './view-drawings.controller';
import { AppService } from 'src/app.service';

@Module({
  controllers: [ViewDrawingsController],
  providers:[AppService]
})
export class ViewsModule {}
