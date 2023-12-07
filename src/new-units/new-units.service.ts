import { Injectable } from '@nestjs/common';
import POOLOPTIONS from 'src/common/pool-options';
import { Pool, createPool } from 'mysql2/promise';
import { UnitsDTO } from './dto/saveUnits.dto';

@Injectable()
export class NewUnitsService {
  private connection: Pool;
  constructor() {
    this.connection = createPool(POOLOPTIONS);
  }

  async getOrder(id: string) {
    try {
      const data = await this.connection.query(`SELECT order_machine, number_machine, name_machine, customers.customer 
      FROM machines JOIN customers ON machines.idcustomer=customers.idcustomer WHERE order_machine='${id}' AND isClosed=0;`);
      return data[0][0];
    } catch (error) {
      return { serverError: error.message };
    }

  }

  async getUnits(id: string) {
    try {
      const data = await this.connection.query(`SELECT id_specification,unit, number_unit, name_unit, idauthor, status_unit, weight, users.nameUser FROM units LEFT JOIN users ON units.idauthor=users.iduser WHERE order_machine='${id}' ORDER BY ind;`);
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
      console.log(updateInsertString);
      const results = await this.connection.query(updateInsertString);
      console.log(results);
      return { response: 'ok'};
    } catch (error) {
      return { serverError: error.message };
    }
  }

}
