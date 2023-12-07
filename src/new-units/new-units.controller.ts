import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { NewUnitsService } from './new-units.service';

@Controller('/editUnits')
export class NewUnitsController {
  constructor(private unitsService: NewUnitsService) { }

  @Get('getOrder-:id')
  getOrder(@Param('id') id: string) {
    return this.unitsService.getOrder(id);
  }

  @Get('getUnits-:id')
  getUnits(@Param('id') id: string) {
    return this.unitsService.getUnits(id);
  }

  @Put('saveUnits')
  updateOrder(@Body() bodyData): any {
    return this.unitsService.saveUnits(bodyData);
  }

}
