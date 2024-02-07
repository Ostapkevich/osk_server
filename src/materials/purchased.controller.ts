import { AppService } from "src/app.service";
import { Controller, Get, Param, Body, Query, Post, Put, Delete } from '@nestjs/common';



@Controller('/purchased')
export class PurchasedController  {
constructor(protected appService: AppService){}

@Get('onLoad')
async onLoad() {
  try {
    const material_type = `SELECT id_type, name_type, ind FROM purchased_type ORDER BY ind;`;
    const materials = `SELECT id_item, name_item, x1, x2, weight FROM purchased JOIN purchased_type ON purchased.id_type=purchased_type.id_type ORDER BY purchased_type.ind, x1, x2 LIMIT 0,20;`
    const data = await this.appService.query(material_type, materials);
    return { material_type: data[0][0], materials: data[1][0] };
  } catch (error) {
    return { serverError: error.message };
  }
}

@Delete('deleteMaterial')
async deleteUnit(@Query('q0') id: string) {
  try {
    const data = await this.appService.execute(`DELETE FROM purchased WHERE id_item=?;`, [id]);
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
        sql = `SELECT id_item, name_item, x1, x2, weight FROM purchased JOIN purchased_type ON purchased.id_type=purchased_type.id_type WHERE ${str} ORDER BY purchased_type.ind, x1, x2 LIMIT ${position},20;`
      } else {
        sql = `SELECT id_item, name_item, x1, x2, weight FROM purchased JOIN purchased_type ON purchased.id_type=purchased_type.id_type ORDER BY purchased_type.ind, x1, x2 LIMIT ${position},20;`
      }
    } else {
      if (str.length > 0) {
        sql = `SELECT id_item, name_item, x1, x2, weight FROM purchased JOIN purchased_type ON purchased.id_type=purchased_type.id_type WHERE purchased.id_type=${materialtype} AND ${str} ORDER BY purchased_type.ind, x1, x2 LIMIT ${position},20;`
      } else {
        sql = `SELECT id_item, name_item, x1, x2, weight FROM purchased JOIN purchased_type ON purchased.id_type=purchased_type.id_type  WHERE purchased.id_type=${materialtype}  ORDER BY purchased_type.ind, x1, x2 LIMIT ${position},20;`
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
    strInsertData = `INSERT purchased (id_type, name_item, x1, x2, weight) VALUES (?,?,?,?,?)`;
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
    const strUpdateData = `UPDATE purchased SET name_item=?, x1=?, x2=?, weight=? WHERE id_item=?`;
    const data = await this.appService.execute(strUpdateData, arrData);
    if (data[0]['affectedRows'] === 1) {
      return { response: 'ok' };
    }
  } catch (error) {
    return { serverError: 'Ошибка сервера: ' + error.message };
  }
}



}