import { Controller, Get, Param, Body } from '@nestjs/common';
import { AppService } from 'src/app.service';

@Controller('/materials')
export class MaterialsController {
  constructor(private appService: AppService) { }

  @Get('onLoad')
  async onLoad() {
    try {
      const rolled_type = 'SELECT idrolled_type, name_typerolled, ind FROM rolled_type;';
      const steels = 'SELECT idsteel, steel, ind FROM steels';
      const rolleds = 'SELECT id_rolled, name_rolled, d, t, steels.steel, weight FROM rolled JOIN steels ON rolled.idsteel=steels.idsteel ORDER BY idrolled_type, steels.ind, d, t ;'
      const data = await this.appService.query(rolled_type, steels, rolleds);
      return { rolled_type: data[0][0], steels: data[1][0], rolleds: data[2][0] };
    } catch (error) {
      return { serverError: error.message };
    }
  }

  @Get('rolleds/:rolledtype/:steel/:position')
  async loadRolled(@Param('rolledtype') rolledtype: number, @Param('steel') steel: number, @Param('position') position: number,
    @Body() bodyData: string[]) {
    try {
      let str = ``;
      if (bodyData && bodyData.length > 0) {

        for (const i of bodyData) {
          str = str + `name_rolled regexp regexp ('${i}') AND `;
        }
        str = str.slice(0, str.length - 4);
      }
      console.log(str);
      let sql: string;
      switch (rolledtype) {
        case 1:
          switch (steel) {
            case 1: //любой тип проката и любая сталь
              if (str.length > 0) {
                sql = `SELECT id_rolled, name_rolled, d, t, steels.steel, weight FROM rolled JOIN steels ON rolled.idsteel=steels.idsteel WHERE '${str}' ORDER BY idrolled_type, steels.ind, d, t LIMIT ${position},20;`
              } else {
                sql = `SELECT id_rolled, name_rolled, d, t, steels.steel, weight FROM rolled JOIN steels ON rolled.idsteel=steels.idsteel ORDER BY idrolled_type, steels.ind, d, t LIMIT ${position},20;`
              }
              break;
            default: //любой тип проката и определенная сталь
              if (str.length > 0) {
                sql = `SELECT id_rolled, name_rolled, d, t, steels.steel, weight FROM rolled JOIN steels ON rolled.idsteel=steels.idsteel WHERE rolled.idsteel=${steel} ORDER BY idrolled_type, steels.ind, d, t LIMIT ${position},20;`
              } else {
                sql = `SELECT id_rolled, name_rolled, d, t, steels.steel, weight FROM rolled JOIN steels ON rolled.idsteel=steels.idsteel WHERE rolled.idsteel=${steel} AND '${str}' ORDER BY idrolled_type, steels.ind, d, t LIMIT ${position},20;`
              }
              break;
          }
          break;
        default: //определенный тип проката и любая сталь
          switch (steel) {
            case 1:
              if (str.length > 0) {
                sql = `SELECT id_rolled, name_rolled, d, t, steels.steel, weight FROM rolled JOIN steels ON rolled.idsteel=steels.idsteel WHERE rolled.id_rolled=${rolledtype} ORDER BY idrolled_type, steels.ind, d, t LIMIT ${position},20;`
              } else {
                sql = `SELECT id_rolled, name_rolled, d, t, steels.steel, weight FROM rolled JOIN steels ON rolled.idsteel=steels.idsteel WHERE rolled.id_rolled=${rolledtype} AND '${str}' ORDER BY idrolled_type, steels.ind, d, t LIMIT ${position},20;`
              } break;
            default: //определенный тип проката и определенная сталь
              if (str.length > 0) {
                sql = `SELECT id_rolled, name_rolled, d, t, steels.steel, weight FROM rolled JOIN steels ON rolled.idsteel=steels.idsteel WHERE rolled.id_rolled=${rolledtype} AND rolled.idsteel=${steel} ORDER BY idrolled_type, steels.ind, d, t LIMIT ${position},20;`
              } else {
                sql = `SELECT id_rolled, name_rolled, d, t, steels.steel, weight FROM rolled JOIN steels ON rolled.idsteel=steels.idsteel WHERE rolled.id_rolled=${rolledtype} AND rolled.idsteel=${steel} AND '${str}' ORDER BY idrolled_type, steels.ind, d, t LIMIT ${position},20;`

              } break;
          }
          break;
      }
      const rolledsData = await this.appService.query(sql);

      return { rolleds: rolledsData[0][0] };
    } catch (error) {
      return { serverError: error.message };
    }
  }

}



