import { Module } from '@nestjs/common';
import { NewOrderController } from './new-order.controller';
import { NewOrderService } from './new-order.service';
@Module({
  providers: [NewOrderService],
  controllers: [NewOrderController],
})
export class NewOrderModule {}
