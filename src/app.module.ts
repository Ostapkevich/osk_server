import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AppController } from './app.controller';
import { join } from 'path';
import { NewOrderModule } from './new-order/new-order.module';
import { NewUnitsModule } from './new-units/new-units.module';
import { MaterialsModule } from './materials/materials.module';
import { DrawingsModule } from './drawings/drawings.module';
import { ViewsModule } from './view/views.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname ,'../..','drawings'),
    }),
    ViewsModule,
  DrawingsModule,
    NewOrderModule,
    NewUnitsModule,
    MaterialsModule,
  ],
  controllers: [AppController],
  providers: [],
  exports:[],
})
export class AppModule { 
}
