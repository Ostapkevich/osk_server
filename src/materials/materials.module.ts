import { Module } from '@nestjs/common';
import { MaterialsController } from './materials.controller';
import { MaterialsService } from './materials.service';
import { AppService } from 'src/app.service';

@Module({
  controllers: [MaterialsController],
  providers: [MaterialsService, AppService]
})
export class MaterialsModule {}
