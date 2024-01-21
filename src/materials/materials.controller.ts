import { Controller, Get, Param, Body, Query, Post, Put, Delete } from '@nestjs/common';
import { AppService } from 'src/app.service';


@Controller('/materials')
export class MaterailsController {
  constructor(protected appService: AppService) {

  }

  @Get('onLoad')
  async onLoad() {
    try {
      const material_type = `SELECT id_type, name_type, ind FROM material_type ORDER BY ind;`;
      const materials = `SELECT id_item, name_item, x1, x2, units, specific_units, percent FROM material JOIN material_type ON material.id_type=material_type.id_type ORDER BY material_type.ind, x1, x2 LIMIT 0,20;`
      const data = await this.appService.query(material_type, materials);
      return { material_type: data[0][0], materials: data[1][0] };
    } catch (error) {
      return { serverError: error.message };
    }
  }

  
  @Get('getUseLenth/:id')
  async getUseLenth(@Param() id:number) {
    try {
      const  sql= `SELECT uselength FROM rolled_type where id_type in (select id_type from rolled where id_item=${id}) ;`;
      const data = await this.appService.query(sql);
      return {useLenth: data[0][0]};
    } catch (error) {
      return { serverError: error.message };
    }
  }


  @Delete('deleteMaterial')
  async deleteUnit(@Query('q0') id: string) {
    try {
      const data = await this.appService.execute(`DELETE FROM material WHERE id_item=?;`, [id]);
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


  @Get('getMaterial/:materialtype/:position')
  async loadRolled(@Param('materialtype') materialtype: number, @Param('position') position: number,
    @Query() bodyData) {
    try {
      let str = ``;
      if (bodyData.hasOwnProperty('sql0')) {
        str = str + `name_item LIKE '%${bodyData.sql0}%' `;
      }
      let sql: string;
      if (+materialtype === -1) {
        if (str.length > 0) {
          sql = `SELECT id_item, name_item, x1, x2, units, specific_units, percent FROM material JOIN material_type ON material.id_type=material_type.id_type WHERE ${str} ORDER BY material_type.ind, x1, x2 LIMIT ${position},20;`
        } else {
          sql = `SELECT id_item, name_item, x1, x2, units, specific_units, percent FROM material JOIN material_type ON material.id_type=material_type.id_type ORDER BY material_type.ind, x1, x2 LIMIT ${position},20;`
        }
      } else {
        if (str.length > 0) {
          sql = `SELECT id_item, name_item, x1, x2, units, specific_units, percent FROM material JOIN material_type ON material.id_type=material_type.id_type WHERE material.id_type=${materialtype} AND ${str} ORDER BY material_type.ind, x1, x2 LIMIT ${position},20;`
        } else {
          sql = `SELECT id_item, name_item, x1, x2, units, specific_units, percent FROM material JOIN material_type ON material.id_type=material_type.id_type  WHERE material.id_type=${materialtype}  ORDER BY material_type.ind, x1, x2 LIMIT ${position},20;`
        }
      }

      const materialData = await this.appService.query(sql);
      return { materials: materialData[0][0] };
    } catch (error) {
      console.log(error)
      return { serverError: error.message };
    }
  }

  @Post('addMaterial')
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
      strInsertData = `INSERT material (id_type, name_item, x1, x2, units, specific_units, percent) VALUES (?,?,?,?,?,?,?)`;
      const insertMain = await this.appService.execute(strInsertData, arrData);
      if (insertMain[0]['affectedRows'] === 1) {
        return { response: 'ok' };
      }
    } catch (error) {
      console.log(error)
      return { serverError: 'Ошибка сервера: ' + error.message };
    }
  }

  @Put('updateMaterial')
  async updateRolled(@Body() bodyData) {
    try {
      let arrData: Array<any> = [];
      for (const key in bodyData) {
        if (Object.prototype.hasOwnProperty.call(bodyData, key)) {
          let param = bodyData[key];
          arrData.push(param);
        }
      }
      const strUpdateData = `UPDATE material SET name_item=?, x1=?, x2=?, units=?, specific_units=?, percent=? WHERE id_item=?`;
      const data = await this.appService.execute(strUpdateData, arrData);
      if (data[0]['affectedRows'] === 1) {
        return { response: 'ok' };
      }
    } catch (error) {
      return { serverError: 'Ошибка сервера: ' + error.message };
    }
  }

}



