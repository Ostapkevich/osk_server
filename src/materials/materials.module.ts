import { Module } from '@nestjs/common';
import { RolledController } from './rolled.controller';
import { HardwareController } from './hardware.controller';
import { AppService } from 'src/app.service';

@Module({
  controllers: [RolledController, HardwareController],
  providers: [AppService]
})
export class MaterialsModule {}
