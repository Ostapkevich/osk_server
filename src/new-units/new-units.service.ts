import { Injectable } from '@nestjs/common';
import { AppService } from 'src/app.service';
import { UnitsDTO } from './dto/saveUnits.dto';

@Injectable()
export class NewUnitsService {
 
  constructor(private appService:AppService) {
  }

  async loadOrder(id: string) {
    try {
      const data = await this.appService.connection.query(`SELECT order_machine, number_machine, name_machine, customers.customer 
      FROM machines JOIN customers ON machines.idcustomer=customers.idcustomer WHERE order_machine='${id}' AND isClosed=0;`);
      return data[0][0];
    } catch (error) {
      return { serverError: error.message };
    }

  }

  async deleteUnit(id: number) {
    try {
      const data = await this.appService.connection.query(`DELETE FROM units WHERE id_specification=${id};`);
      if (data[0]['affectedRows'] > 0) {
        return { response: 'ok' };
      }
    } catch (error) {
      return { serverError: error.message };
    }
  }

  async isEmptyUnit(id: number) {
    try {
      const data = await this.appService.connection.query(`SELECT id_specification FROM unit_consist WHERE id_specification=${id} LIMIT 1;`);
      console.log((data[0] as []).length)
      return data[0];
    } catch (error) {
      return { serverError: error.message };
    }
  }

  async loadUnits(id: string) {
    try {
      const data = await this.appService.connection.query(`SELECT id_specification,unit, number_unit, name_unit, idauthor, status_unit, weight, DATE_FORMAT(started, '%Y-%m-%d') AS started , DATE_FORMAT(finished, '%Y-%m-%d') AS finished , users.nameUser FROM units LEFT JOIN users ON units.idauthor=users.iduser WHERE order_machine='${id}' ORDER BY ind;`);
      return data[0];
    } catch (error) {
      return { serverError: error.message };
    }
  }



  async saveUnits(units: UnitsDTO[]) {
    try {
      let updateInsertString: string = '';
      for (const item of units) {
        updateInsertString =
          updateInsertString +
          `(${item.id_specification}, '${item.order_machine}', '${item.ind}', '${item.name_unit}', '${item.number_unit}', '${item.unit}', ${item.weight}),`;
      }
      updateInsertString = `INSERT INTO osk.units (id_specification, order_machine, ind, name_unit, number_unit, unit, weight)
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
      const results = await this.appService.connection.query(updateInsertString);
      console.log(updateInsertString)
      console.log(results)
      if (results[0]['affectedRows'] > 0) {
        return { response: 'ok' };
      } else { response: 'no' };
    } catch (error) {
      return { serverError: error.message };
    }
  }

}
