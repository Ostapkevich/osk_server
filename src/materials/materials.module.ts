import { Module } from '@nestjs/common';
import { MaterialsController } from './materials.controller';
import { AppService } from 'src/app.service';

@Module({
  controllers: [MaterialsController],
  providers: [AppService]
})
export class MaterialsModule {}
