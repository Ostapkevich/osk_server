import { Controller, Get, Post, Param, Body, Put } from '@nestjs/common';
import { NewOrderDTO } from './dto/new-order.dto';
import { NewOrderService } from './new-order.service';
import { EditedOrderDTO } from './dto/edited-order.dto';
     
@Controller('/newOrder')
export class NewOrderController {
  constructor(private machineService: NewOrderService) {}
  @Get('selectcustcat')
  getCustCat() {
    return this.machineService.selectCustCat();
  }

  @Get('load-newOrder-:id')
  getNewOrder(@Param('id') id: string) {
    return this.machineService.loadNewOrder(id);
  }

  @Get('load-analogOrder-:id')
  getAnalogOrder(@Param('id') id: string) {
    return this.machineService.loadAnalogOrder(id);
  }

  @Get('machine-description-:id')
  getOrderDescription(@Param('id') id: string) {
    return this.machineService.descriptionOrder(id);
  }

  @Post('new')
  insertOrder(@Body() bodyData: NewOrderDTO): any {
    return this.machineService.createOrder(bodyData);
  }

  @Put('edit')
  updateOrder(@Body() bodyData: EditedOrderDTO): any {
    return this.machineService.updateOrder(bodyData);
  }
}
