import { Module } from '@nestjs/common';
import { NewOrderController } from './new-order.controller';
import { AppService } from 'src/app.service';

@Module({
  providers: [AppService],
  controllers: [NewOrderController]
})
export class NewOrderModule {}
