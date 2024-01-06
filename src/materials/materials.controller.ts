import { Controller, Get, Param, Body, Query, Post, Put, Delete } from '@nestjs/common';
import { AppService } from 'src/app.service';


@Controller('/materials')
export class MaterailsController {
  constructor(protected appService: AppService) {
   
  }
  itemTable = 'material';
  categoryTable = 'material_type';
  
  @Get('onLoad')
  async onLoad() {
    try {
      const material_type = `SELECT id_type, name_type, ind FROM ${this.categoryTable} ORDER BY ind;`;
      const materials = `SELECT idmaterial, name_material, x1, x2, units, specific_units, percent FROM ${this.itemTable} JOIN ${this.categoryTable} ON ${this.itemTable}.id_type=${this.categoryTable}.id_type ORDER BY ${this.categoryTable}.ind, x1, x2 LIMIT 0,20;`
      const data = await this.appService.query(material_type, materials);
      return { material_type: data[0][0], materials: data[1][0] };

    } catch (error) {
           return { serverError: error.message };
    }
  }

  @Delete('deleteMaterial')
  async deleteUnit(@Query('q0') id: string) {
    try {
      const data = await this.appService.execute(`DELETE FROM ${this.itemTable} WHERE idmaterial=?;`, [id]);
      if (data[0]['affectedRows'] === 1) {
        return { response: 'ok' };
      }
    } catch (error) {
        return { serverError: error.message };
    }
  }


  @Get('isUsedMaterial/:id')
  async isUsedRolled(@Param('id') id: number) {
    try {
      const sql = `SELECT idmaterial FROM drawing WHERE idmaterial=? LIMIT 1;`;
      const data = await this.appService.execute(sql, [1]);
      return data[0];
    } catch (error) {
      return { serverError: error.message };
    }
  }


  @Get('getMaterial/:materialtype/:position')
  async loadRolled(@Param('materialtype') materialtype: number, @Param('position') position: number,
    @Query() bodyData) {
    try {
      let str = ``;
      if (bodyData.hasOwnProperty('sql0')) {
        str = str + `name_material LIKE '%${bodyData.sql0}%' `;
      }
      let sql: string;
      if (+materialtype === -1) {
        if (str.length > 0) {
          sql = `SELECT idmaterial, name_material, x1, x2, units, specific_units, percent FROM ${this.itemTable} JOIN ${this.categoryTable} ON ${this.itemTable}.id_type=${this.categoryTable}.id_type WHERE ${str} ORDER BY material_type.ind, x1, x2 LIMIT ${position},20;`
        } else {
          sql = `SELECT idmaterial, name_material, x1, x2, units, specific_units, percent FROM ${this.itemTable} JOIN ${this.categoryTable} ON ${this.itemTable}.id_type=${this.categoryTable}.id_type ORDER BY ${this.categoryTable}.ind, x1, x2 LIMIT ${position},20;`
        }
      } else {
        if (str.length > 0) {
          sql = `SELECT idmaterial, name_material, x1, x2, units, specific_units, percent FROM ${this.itemTable} JOIN ${this.categoryTable} ON ${this.itemTable}.id_type=${this.categoryTable}.id_type WHERE ${this.itemTable}.id_type=${materialtype} AND ${str} ORDER BY ${this.categoryTable}.ind, x1, x2 LIMIT ${position},20;`
        } else {
          sql = `SELECT idmaterial, name_material, x1, x2, units, specific_units, percent FROM ${this.itemTable} JOIN ${this.categoryTable} ON ${this.itemTable}.id_type=${this.categoryTable}.id_type  WHERE ${this.itemTable}.id_type=${materialtype}  ORDER BY ${this.categoryTable}.ind, x1, x2 LIMIT ${position},20;`
        }
      }
    
      const materialData = await this.appService.query(sql);
      return { materials: materialData[0][0] };
    } catch (error) {
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
      strInsertData = `INSERT ${this.itemTable} (id_type, name_material, x1, x2, weight) VALUES (?,?,?,?,?)`;
      const insertMain = await this.appService.execute(strInsertData, arrData);
      if (insertMain[0]['affectedRows'] === 1) {
        return { response: 'ok' };
      }
    } catch (error) {
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
      const strUpdateData = `UPDATE ${this.itemTable} SET name_material=?, x1=?, x2=?, units=?, specific_units=?, percent=? WHERE idmaterial=?`;
      const data = await this.appService.execute(strUpdateData, arrData);
console.log(arrData)
      if (data[0]['affectedRows'] === 1) {
        return { response: 'ok' };
      }
    } catch (error) {
      return { serverError: 'Ошибка сервера: ' + error.message };
    }
  }

}



