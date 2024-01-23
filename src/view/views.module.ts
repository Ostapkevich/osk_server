import { Module } from '@nestjs/common';
import { ViewDrawingsController } from './view-drawings.controller';

@Module({
  controllers: [ViewDrawingsController]
})
export class ViewsModule {}
