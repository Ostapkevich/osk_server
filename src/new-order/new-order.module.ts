import { Module } from '@nestjs/common';
import { NewOrderController } from './new-order.controller';
import { NewOrderService } from './new-order.service';
import { AppService } from 'src/app.service';

@Module({
  providers: [NewOrderService, AppService],
  controllers: [NewOrderController]
})
export class NewOrderModule {}
