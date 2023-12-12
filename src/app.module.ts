import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { join } from 'path';

import { NewOrderModule } from './new-order/new-order.module';
import { NewUnitsModule } from './new-units/new-units.module';
import { MaterialsModule } from './materials/materials.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'oskmanager'),
    }),
    NewOrderModule,
    NewUnitsModule,
    MaterialsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports:[AppService],
})
export class AppModule {}
