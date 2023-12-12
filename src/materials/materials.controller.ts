import { Controller, Get, Param } from '@nestjs/common';
import { MaterialsService } from './materials.service';

@Controller('/materials')
export class MaterialsController {
constructor(private materialService:MaterialsService){
  console.log(materialService)
}

@Get('rolledTypeAndSteel')
loadTypeAndSteel() {
  return this.materialService.loadTypeAndSteel();
}

@Get('rolled')
loadRolled() {
  return this.materialService.loadRolled();
}




}
