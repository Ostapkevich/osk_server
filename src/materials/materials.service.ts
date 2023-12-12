import { Injectable } from '@nestjs/common';
import { AppService } from 'src/app.service';


@Injectable()
export class MaterialsService {
  constructor(private appService: AppService) {
  }

  async loadTypeAndSteel() {
    try {
      const rolled_type = await this.appService.connection.query(
        'SELECT idrolled_type, name_typerolled, ind FROM rolled_type',
      );
      const steels = await this.appService.connection.query(
        'SELECT idsteel, steel, ind FROM steels',
      );
      return { rolled_type: rolled_type[0], steels: steels[0] };

    } catch (error) {
      return { serverError: error.message };
    }
  }


  async loadRolled() {
    try {
      const rolled = await this.appService.connection.query(
        'SELECT id_rolled, name_rolled, d, t, steels.steel, weight FROM rolled JOIN steels ON rolled.idsteel=steels.idsteel ORDER BY idrolled_type, steels.ind, d, t ;'
      );
     
      return rolled[0];

    } catch (error) {
      return { serverError: error.message };
    }
  }

}
