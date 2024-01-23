import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { join } from 'path';

import { NewOrderModule } from './new-order/new-order.module';
import { NewUnitsModule } from './new-units/new-units.module';
import { MaterialsModule } from './materials/materials.module';
import { DrawingsController } from './drawings/drawings.controller';
import { ScanService } from './scan/scan.service';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname ,'../..','drawings'),
    }),
  
    NewOrderModule,
    NewUnitsModule,
    MaterialsModule,
  ],
  controllers: [AppController, DrawingsController],
  providers: [AppService, ScanService],
  exports:[AppService],
})
export class AppModule {}
