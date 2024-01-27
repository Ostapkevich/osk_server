import { Controller, Get, Param, Body, Query, Post, Put, Delete } from '@nestjs/common';
import { AppService } from 'src/app.service';

@Controller('/rolled')
export class RolledController {

  constructor(private appService: AppService) { 
  
  }



  @Get('onLoad')
  async onLoad() {
    try {
      const rolled_type = 'SELECT id_type, name_type, ind, uselength FROM rolled_type ORDER BY ind;';
      const steels = 'SELECT idsteel, steel, ind FROM steels ORDER BY ind';
      const rolleds = 'SELECT id_item, name_item, d, t, steels.steel, weight, rolled_type.uselength FROM rolled JOIN steels ON rolled.idsteel=steels.idsteel JOIN rolled_type ON rolled_type.id_type=rolled.id_type ORDER BY rolled_type.ind, d, t, steels.ind LIMIT 0,20;'
      const data = await this.appService.query(rolled_type, steels, rolleds);
      return { rolled_type: data[0][0], steels: data[1][0], rolleds: data[2][0] };
    } catch (error) {
      return { serverError: error.message };
    }
  }

  @Delete('deleteRolled')
  async deleteUnit(@Query('q0') id: string) {
    try {
      const data = await this.appService.execute(`DELETE FROM rolled WHERE id_item=?;`, [id]);
      if (data[0]['affectedRows'] === 1) {
        return { response: 'ok' };
      }
    } catch (error) {
      if (error.errno === 1451) {
        return { serverError: 'Удаление невозможно! В базе имеются данные, использующие данную позицию!' };
      } else {
        return { serverError: 'Ошибка сервера: ' + error.message };
      }
    }
  }




  @Get('getRolled/:rolledtype/:steel/:position')
  async loadRolled(@Param('rolledtype') rolledtype: number, @Param('steel') steel: number, @Param('position') position: number,
    @Query() bodyData) {
    try {
      let str = ``;
      if (bodyData.hasOwnProperty('sql0')) {
        str = str + `name_item LIKE '%${bodyData.sql0}%' `;
      }
      let sql: string;
      if (+rolledtype === -1) {
        if (+steel === -1) {
          if (str.length > 0) {
            sql = `SELECT id_item, name_item, d, t, steels.steel, weight, rolled_type.uselength FROM rolled JOIN steels ON rolled.idsteel=steels.idsteel JOIN rolled_type ON rolled_type.id_type=rolled.id_type  WHERE ${str} ORDER BY rolled_type.ind, d, t, steels.ind LIMIT ${position},20;`
          } else {
            sql = `SELECT id_item, name_item, d, t, steels.steel, weight, rolled_type.uselength FROM rolled JOIN steels ON rolled.idsteel=steels.idsteel JOIN rolled_type ON rolled_type.id_type=rolled.id_type ORDER BY rolled_type.ind, d, t, steels.ind LIMIT ${position},20;`
          }
        } else {
          if (str.length > 0) {
            sql = `SELECT id_item, name_item, d, t, steels.steel, weight, rolled_type.uselength FROM rolled JOIN steels ON rolled.idsteel=steels.idsteel JOIN rolled_type ON rolled_type.id_type=rolled.id_type WHERE rolled.idsteel=${steel} AND ${str} ORDER BY rolled_type.ind, d, t, steels.ind LIMIT ${position},20;`
          } else {
            sql = `SELECT id_item, name_item, d, t, steels.steel, weight, rolled_type.uselength FROM rolled JOIN steels ON rolled.idsteel=steels.idsteel JOIN rolled_type ON rolled_type.id_type=rolled.id_type WHERE rolled.idsteel=${steel}  ORDER BY rolled_type.ind, d, t, steels.ind LIMIT ${position},20;`
          }
        }
      } else {
        if (+steel === -1) {
          if (str.length > 0) {
            sql = `SELECT id_item, name_item, d, t, steels.steel, weight, rolled_type.uselength FROM rolled JOIN steels ON rolled.idsteel=steels.idsteel JOIN rolled_type ON rolled_type.id_type=rolled.id_type WHERE rolled.id_type=${rolledtype} AND ${str} ORDER BY rolled_type.ind, d, t, steels.ind LIMIT ${position},20;`
          } else {
            sql = `SELECT id_item, name_item, d, t, steels.steel, weight, rolled_type.uselength FROM rolled JOIN steels ON rolled.idsteel=steels.idsteel JOIN rolled_type ON rolled_type.id_type=rolled.id_type WHERE rolled.id_type=${rolledtype}  ORDER BY rolled_type.ind, d, t, steels.ind LIMIT ${position},20;`
          }
        } else {
          if (str.length > 0) {
            sql = `SELECT id_item, name_item, d, t, steels.steel, weight, rolled_type.uselength FROM rolled JOIN steels ON rolled.idsteel=steels.idsteel JOIN rolled_type ON rolled_type.id_type=rolled.id_type WHERE rolled.id_type=${rolledtype} AND rolled.idsteel=${steel} AND ${str} ORDER BY rolled_type.ind, d, t, steels.ind LIMIT ${position},20;`
          } else {
            sql = `SELECT id_item, name_item, d, t, steels.steel, weight, rolled_type.uselength FROM rolled JOIN steels ON rolled.idsteel=steels.idsteel JOIN rolled_type ON rolled_type.id_type=rolled.id_type WHERE rolled.id_type=${rolledtype} AND rolled.idsteel=${steel}  ORDER BY rolled_type.ind, d, t, steels.ind LIMIT ${position},20;`
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
      let arrData: Array<any> = [];
      for (const key in bodyData) {
        if (Object.prototype.hasOwnProperty.call(bodyData, key)) {
          let param = bodyData[key];
          arrData.push(param);
        }
      }
      strInsertData = `INSERT rolled (id_type, idsteel, name_item, d, weight, t) VALUES (?,?,?,?,?,?)`;
      const insertMain = await this.appService.execute(strInsertData, arrData);
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
      let arrData: Array<any> = [];
      for (const key in bodyData) {
        if (Object.prototype.hasOwnProperty.call(bodyData, key)) {
          let param = bodyData[key];
          arrData.push(param);
        }
      }
      const strUpdateData = `UPDATE rolled SET name_item=?, d=?, weight=?, t=? WHERE id_item=?`;
      const data = await this.appService.execute(strUpdateData, arrData);

      if (data[0]['affectedRows'] === 1) {
        return { response: 'ok' };
      }
    } catch (error) {
      return { serverError: 'Ошибка сервера: ' + error.message };
    }
  }

}



