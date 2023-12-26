import { Controller, Get, Param, Body, Query, Post, Put, Delete } from '@nestjs/common';
import { AppService } from 'src/app.service';


@Controller('/hardware')
export class HardwareController {
  constructor(private appService: AppService) { }

  @Get('onLoad')
  async onLoad() {
    try {
      const hardware_type = 'SELECT idhardware_type, name_type, ind FROM hardware_type ORDER BY ind;';
      const steels = 'SELECT idsteel, steel, ind FROM steels ORDER BY ind';
      const hardwares = 'SELECT idhardware, name_hardware, d, L, steels.steel, weight FROM hardware JOIN steels ON hardware.idsteel=steels.idsteel ORDER BY idhardware_type, d, L ;'
      const data = await this.appService.query(hardware_type, steels, hardwares);
      return { hardware_type: data[0][0], steels: data[1][0], hardwares: data[2][0] };
    } catch (error) {
      return { serverError: error.message };
    }
  }

  @Delete('deleteHardware')
  async deleteUnit(@Query('q0') id: string)
    {
    try {
      const data = await this.appService.execute(`DELETE FROM hardware WHERE idhardware=?;`, [id]);
      if (data[0]['affectedRows'] === 1) {
        return { response: 'ok' };
      }
    } catch (error) {
      return { serverError: error.message };
    }
  }


  @Get('isUsedHardware/:id')
  async isUsedRolled(@Param('id') id: number) {
    try {
      const sql = `SELECT idhardware FROM unit_consist WHERE idhardware=? LIMIT 1;`;
      const data = await this.appService.execute(sql, [1]);
      return data[0];
    } catch (error) {
      console.log(error)
      return { serverError: error.message };
    }
  }


  @Get('getHardware/:rolledtype/:steel/:position')
  async loadRolled(@Param('rolledtype') rolledtype: number, @Param('steel') steel: number, @Param('position') position: number,
    @Query() bodyData) {
    try {
      let str = ``;
      if (bodyData.hasOwnProperty('sql0')) {
        str = str + `name_hardware LIKE '%${bodyData.sql0}%' `;
      }
      let sql: string;
      if (+rolledtype === 1) {
        if (+steel === 1) {
          if (str.length > 0) {
            sql = `SELECT idhardware, name_hardware, d, L, steels.steel, weight FROM hardware JOIN steels ON hardware.idsteel=steels.idsteel WHERE ${str} ORDER BY idhardware_type, d, L LIMIT ${position},20;`
          } else {
            sql = `SELECT idhardware, name_hardware, d, L, steels.steel, weight FROM hardware JOIN steels ON hardware.idsteel=steels.idsteel ORDER BY idhardware_type, d, L LIMIT ${position},20;`
          }
        } else {
          if (str.length > 0) {
            sql = `SELECT idhardware, name_hardware, d, L, steels.steel, weight FROM hardware JOIN steels ON hardware.idsteel=steels.idsteel WHERE hardware.idsteel=${steel} AND ${str} ORDER BY idhardware_type, d, L LIMIT ${position},20;`
          } else {
            sql = `SELECT idhardware, name_hardware, d, L, steels.steel, weight FROM hardware JOIN steels ON hardware.idsteel=steels.idsteel WHERE hardware.idsteel=${steel}  ORDER BY idhardware_type, d, L LIMIT ${position},20;`
          }
        }
      } else {
        if (+steel === 1) {
          if (str.length > 0) {
            sql = `SELECT idhardware, name_hardware, d, L, steels.steel, weight FROM hardware JOIN steels ON hardware.idsteel=steels.idsteel WHERE hardware.idhardware_type=${rolledtype} AND ${str} ORDER BY idhardware_type, d, L LIMIT ${position},20;`
          } else {
            sql = `SELECT idhardware, name_hardware, d, L, steels.steel, weight FROM hardware JOIN steels ON hardware.idsteel=steels.idsteel WHERE hardware.idhardware_type=${rolledtype}  ORDER BY idhardware_type, d, L LIMIT ${position},20;`
          }
        } else {
          if (str.length > 0) {
            sql = `SELECT idhardware, name_hardware, d, L, steels.steel, weight FROM hardware JOIN steels ON hardware.idsteel=steels.idsteel WHERE hardware.idhardware_type=${rolledtype} AND hardware.idsteel=${steel} AND ${str} ORDER BY idhardware_type, d, L LIMIT ${position},20;`
          } else {
            sql = `SELECT idhardware, name_hardware, d, L, steels.steel, weight FROM hardware JOIN steels ON hardware.idsteel=steels.idsteel WHERE hardware.idhardware_type=${rolledtype} AND hardware.idsteel=${steel}  ORDER BY idhardware_type, d, L LIMIT ${position},20;`
          }
        }
      }
     
      const hardwaresData = await this.appService.query(sql);
      return { hardwares: hardwaresData[0][0] };
    } catch (error) {
        console.log(error)
      return { serverError: error.message };
    }
  }

  @Post('addHardware')
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
      strInsertData = `INSERT hardware (idhardware_type, idsteel, name_hardware, d, weight, L) VALUES (?,?,?,?,?,?)`;
      console.log(arrData)
      const insertMain = await this.appService.execute(strInsertData, arrData);
      if (insertMain[0]['affectedRows'] === 1) {
        return { response: 'ok' };
      }
    } catch (error) {
      return { serverError: 'Ошибка сервера: ' + error.message };
    }
  }

  @Put('updateHardware')
  async updateRolled(@Body() bodyData) {
    try {
      let arrData: Array<any> = [];
      for (const key in bodyData) {
        if (Object.prototype.hasOwnProperty.call(bodyData, key)) {
          let param = bodyData[key];
          arrData.push(param);
        }
      }
      const strUpdateData = `UPDATE hardware SET name_hardware=?, d=?, weight=?, L=? WHERE idhardware=?`;
      console.log(strUpdateData)
      const data = await this.appService.execute(strUpdateData, arrData);

      if (data[0]['affectedRows'] === 1) {
        return { response: 'ok' };
      }
    } catch (error) {
      return { serverError: 'Ошибка сервера: ' + error.message };
    }
  }

}



