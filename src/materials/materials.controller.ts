import { Controller, Get, Param, Body, Query, Post, Put } from '@nestjs/common';
import { AppService } from 'src/app.service';
import { IaddRolled } from './dto/matarials';

@Controller('/materials')
export class MaterialsController {
  constructor(private appService: AppService) { }

  @Get('onLoad')
  async onLoad() {
    try {
      const rolled_type = 'SELECT idrolled_type, name_typerolled, ind FROM rolled_type;';
      const steels = 'SELECT idsteel, steel, ind FROM steels';
      const rolleds = 'SELECT id_rolled, name_rolled, d, t, steels.steel, weight FROM rolled JOIN steels ON rolled.idsteel=steels.idsteel ORDER BY idrolled_type, d, t ;'
      const data = await this.appService.query(rolled_type, steels, rolleds);
      return { rolled_type: data[0][0], steels: data[1][0], rolleds: data[2][0] };
    } catch (error) {
      return { serverError: error.message };
    }
  }

  @Get('rolleds/:rolledtype/:steel/:position')
  async loadRolled(@Param('rolledtype') rolledtype: number, @Param('steel') steel: number, @Param('position') position: number,
    @Query() bodyData) {
    try {
        let str = ``;
        if (bodyData) {
          let i = 0;
          for (const key in bodyData) {
            if (Object.prototype.hasOwnProperty.call(bodyData, key)) {
              const value = bodyData[key];
              str = str + `name_rolled regexp ('${value}') AND `;
            }
          }
          str = str.slice(0, str.length - 4);
     
      }
      let sql: string;
        if (+rolledtype === 1) {
        if (+steel === 1) {
          if (str.length > 0) {
            sql = `SELECT id_rolled, name_rolled, d, t, steels.steel, weight FROM rolled JOIN steels ON rolled.idsteel=steels.idsteel WHERE ${str} ORDER BY idrolled_type, d, t LIMIT ${position},20;`
          } else {
            sql = `SELECT id_rolled, name_rolled, d, t, steels.steel, weight FROM rolled JOIN steels ON rolled.idsteel=steels.idsteel ORDER BY idrolled_type, d, t LIMIT ${position},20;`
          }
        } else {
          if (str.length > 0) {
            sql = `SELECT id_rolled, name_rolled, d, t, steels.steel, weight FROM rolled JOIN steels ON rolled.idsteel=steels.idsteel WHERE rolled.idsteel=${steel} AND ${str} ORDER BY idrolled_type, d, t LIMIT ${position},20;`
          } else {
            sql = `SELECT id_rolled, name_rolled, d, t, steels.steel, weight FROM rolled JOIN steels ON rolled.idsteel=steels.idsteel WHERE rolled.idsteel=${steel}  ORDER BY idrolled_type, d, t LIMIT ${position},20;`
          }
        }
      } else {
        if (+steel === 1) {
          if (str.length > 0) {
            sql = `SELECT id_rolled, name_rolled, d, t, steels.steel, weight FROM rolled JOIN steels ON rolled.idsteel=steels.idsteel WHERE rolled.idrolled_type=${rolledtype} AND ${str} ORDER BY idrolled_type, d, t LIMIT ${position},20;`
          } else {
            sql = `SELECT id_rolled, name_rolled, d, t, steels.steel, weight FROM rolled JOIN steels ON rolled.idsteel=steels.idsteel WHERE rolled.idrolled_type=${rolledtype}  ORDER BY idrolled_type, d, t LIMIT ${position},20;`
          }
        } else {
          if (str.length > 0) {
           sql = `SELECT id_rolled, name_rolled, d, t, steels.steel, weight FROM rolled JOIN steels ON rolled.idsteel=steels.idsteel WHERE rolled.idrolled_type=${rolledtype} AND rolled.idsteel=${steel}AND ${str} ORDER BY idrolled_type, d, t LIMIT ${position},20;`
          } else {
          sql = `SELECT id_rolled, name_rolled, d, t, steels.steel, weight FROM rolled JOIN steels ON rolled.idsteel=steels.idsteel WHERE rolled.idrolled_type=${rolledtype} AND rolled.idsteel=${steel}  ORDER BY idrolled_type, d, t LIMIT ${position},20;`
          }
        }
      }
      const rolledsData = await this.appService.query(sql);
      return { rolleds: rolledsData[0][0] };
    } catch (error) {
      return { serverError: error.message };
    }
  }

  @Post('addRolled')
  async createRolled(@Body() bodyData) {
    try {
      let strInsertData = '';
      let arrData: Array<any>=[];
      for (const key in bodyData) {
         if (Object.prototype.hasOwnProperty.call(bodyData, key)) {
         let param=bodyData[key];
         arrData.push(param);
        }
      }
      strInsertData = `INSERT rolled (idrolled_type, idsteel, name_rolled, d, weight, t) VALUES (?,?,?,?,?,?)`;
      console.log(arrData)
      const insertMain = await this.appService.execute(strInsertData,arrData);
      if (insertMain[0]['affectedRows'] === 1) {
        return { response: 'ok' };
      }
    } catch (error) {
       return { serverError: 'Ошибка сервера: ' + error.message };
    }
  }

  @Put('updateRolled')
  async updateRolled(@Body() bodyData) {
    try {
      let arrData: Array<any>=[];
      for (const key in bodyData) {
         if (Object.prototype.hasOwnProperty.call(bodyData, key)) {
         let param=bodyData[key];
           arrData.push(param);
        }
      }
      const strUpdateData = `UPDATE rolled SET name_rolled=?, d=?, weight=?, t=? WHERE id_rolled=?`;
      console.log(strUpdateData)
      const data = await this.appService.execute(strUpdateData,arrData);
      
      if (data[0]['affectedRows'] === 1) {
        return { response: 'ok' };
      }
    } catch (error) {
       return { serverError: 'Ошибка сервера: ' + error.message };
    }
  }

}



