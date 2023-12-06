import { Injectable } from '@nestjs/common';
import POOLOPTIONS from 'src/common/pool-options';
import { Pool, createPool } from 'mysql2/promise';

@Injectable()
export class NewUnitsService {
  private connection: Pool;
  constructor() {
    this.connection = createPool(POOLOPTIONS);
  }

 async getOrder(id: string) {
    try {
      const data= await this.connection.query(`SELECT order_machine, number_machine, name_machine, customers.customer 
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
}
