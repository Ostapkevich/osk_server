import { Controller, Get, Post, Put, Delete, Param, Body, Query } from '@nestjs/common';
import { AppService } from 'src/app.service';

@Controller('/editUnits')
export class NewUnitsController {
  constructor(private appService: AppService) { }

  @Get('getOrderAndUnits-:id')
  async loadOrderAndUnits(@Param('id') id: string) {
    try {
      const order = await this.appService.execute(`SELECT order_machine, number_machine, name_machine, customers.customer 
      FROM machines JOIN customers ON machines.idcustomer=customers.idcustomer WHERE order_machine=? AND isClosed=0;`, [id]);
      if ((order[0] as []).length === 0) {
        return order[0];
      } else {
        const units = await this.appService.execute(`SELECT id_unit,unit, number_unit, name_unit, idauthor, status_unit, weight, DATE_FORMAT(started, '%Y-%m-%d') AS started,
       DATE_FORMAT(finished, '%Y-%m-%d') AS finished , users.nameUser FROM units LEFT JOIN users ON units.idauthor=users.iduser WHERE order_machine=? ORDER BY ind;`, [id]);
        return [{ order: order[0], units: units[0] }];
      }
    } catch (error) {
      return { serverError: error.message };
    }
  }

  @Get('getUnits-:id')
  async getUnits(@Param('id') id: string) {
    try {
      const data = await this.appService.query(`SELECT id_unit,unit, number_unit, name_unit, idauthor, status_unit, weight, DATE_FORMAT(started, '%Y-%m-%d') AS started , DATE_FORMAT(finished, '%Y-%m-%d') AS finished , users.nameUser FROM units LEFT JOIN users ON units.idauthor=users.iduser WHERE order_machine='${id}' ORDER BY ind;`);
      return data[0][0];
    } catch (error) {
      return { serverError: error.message };
    }
  }

  @Get('isEmptyUnit-:id')
  async isEmptyUnit(@Param('id') id: number) {
    try {
      const data = await this.appService.execute(`SELECT id_unit FROM unit_consist WHERE id_unit=? LIMIT 1;`, [id]);
      return data[0];
    } catch (error) {
      return { serverError: error.message };
    }
  }

  @Delete('deleteUnit')
  async deleteUnit(@Query('q0') sp: string,
  @Query('q1') order: string) {
    try {
      await this.appService.execute(`DELETE FROM units WHERE id_unit=?;`, [sp]);
      const data = await this.appService.execute(`SELECT id_unit,unit, number_unit, name_unit, idauthor, status_unit, weight, DATE_FORMAT(started, '%Y-%m-%d') AS started , DATE_FORMAT(finished, '%Y-%m-%d') AS finished , users.nameUser FROM units LEFT JOIN users ON units.idauthor=users.iduser WHERE order_machine=? ORDER BY ind;`, [order]);
      return data[0];
    } catch (error) {
      return { serverError: error.message };
    }
  }

  @Put('saveUnits-:id')
  async saveUnits(@Param('id') id: number,
    @Body() bodyData) {
    try {
     
      let updateInsertString: string = '';
      for (const item of bodyData) {
        updateInsertString =
          updateInsertString +
          `(${item.id_specification}, '${item.order_machine}', '${item.ind}', '${item.name_unit}', '${item.number_unit}', '${item.unit}', ${item.weight}),`;
      }
      updateInsertString = `INSERT INTO osk.units (id_unit, order_machine, ind, name_unit, number_unit, unit, weight)
  VALUES ${updateInsertString.slice(
        0,
        updateInsertString.length - 1,
      )}
  ON DUPLICATE KEY UPDATE
   ind=VALUES(ind),
   name_unit=VALUES(name_unit),
   number_unit=VALUES(number_unit),  
   unit=VALUES(unit),
   weight=VALUES (weight);`;
      await this.appService.query(updateInsertString);
      const data = await this.appService.execute(`SELECT id_unit,unit, number_unit, name_unit, idauthor, status_unit, weight, DATE_FORMAT(started, '%Y-%m-%d') AS started , DATE_FORMAT(finished, '%Y-%m-%d') AS finished , users.nameUser FROM units LEFT JOIN users ON units.idauthor=users.iduser WHERE order_machine=? ORDER BY ind;`, [id]);
      return data[0];
    } catch (error) {
      return { serverError: error.message };
    }
  }

}
