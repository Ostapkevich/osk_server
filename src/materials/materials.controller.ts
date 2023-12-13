import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from 'src/app.service';

@Controller('/materials')
export class MaterialsController {
  constructor(private appService: AppService) { }

  @Get('rolled')
  async loadRolled() {
    try {
      const rolled_type = 'SELECT idrolled_type, name_typerolled, ind FROM rolled_type;';
      const steels = 'SELECT idsteel, steel, ind FROM steels';
      const rolleds = 'SELECT id_rolled, name_rolled, d, t, steels.steel, weight FROM rolled JOIN steels ON rolled.idsteel=steels.idsteel ORDER BY idrolled_type, steels.ind, d, t ;'
      const data = await this.appService.getData(rolled_type, steels, rolleds);
      return { rolled_type: data[0][0], steels: data[1][0], rolleds: data[2][0] };
    } catch (error) {
      return { serverError: error.message };
    }
  }

}



