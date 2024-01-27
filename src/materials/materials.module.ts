import { Module } from '@nestjs/common';
import { RolledController } from './rolled.controller';
import { HardwareController } from './hardware.controller';
import { MaterailsController } from './materials.controller';
import { AppService } from 'src/app.service';
import { PurchasedController } from './purchased.controller';
import { TypeMaterialsController } from './type-materials.controller';


@Module({
  controllers: [RolledController, HardwareController, MaterailsController, PurchasedController, TypeMaterialsController],
  providers: [AppService]
})
export class MaterialsModule {}
