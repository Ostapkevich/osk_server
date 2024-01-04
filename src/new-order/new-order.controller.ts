import { Controller, Get, Post, Param, Body, Put } from '@nestjs/common';
import { Iorder } from './iNewOrder';
import { AppService } from 'src/app.service';

@Controller('/newOrder')
export class NewOrderController {
  constructor(private appService: AppService) { }
  @Get('selectcustcat')
  async getCustCat() {
    try {
      const sql1 = 'SELECT idcustomer, customer FROM customers';
      const sql2 = 'SELECT idcategory, category FROM machines_categories';
      const data = await this.appService.query(sql1, sql2);
      return { customers: data[0][0], categories: data[1][0] };
    } catch (error) {
      return { serverError: 'Ошибка сервера: ' + error.message };
    }
  }


  @Get('loadOrder:id/:isAnalog')
  async getOrder(@Param('id') id: string,
    @Param('isAnalog') isAnalog: string) {
    try {
      let orderSQL = '';
      if (isAnalog === 'false') {
        orderSQL = `SELECT machines.order_machine, machines.number_machine, machines.name_machine, machines.description, DATE_FORMAT(shipment, '%Y-%m-%d')AS shipment, idcustomer, idcategory, weight FROM machines WHERE machines.isClosed='0' AND machines.order_machine = '${id}' `;
      } else {
        orderSQL = `SELECT machines.number_machine, machines.name_machine, machines.description, idcategory, weight FROM machines WHERE machines.order_machine = '${id}' `;
      }
      const propsSQL = `SELECT machineproperties.idproperty, machineproperties.property, machineproperties.val FROM machineproperties WHERE machineproperties.order_machine = '${id}' `
      const data = await this.appService.query(orderSQL, propsSQL);
      return { order: data[0][0][0], properties: data[1][0] }
    } catch (error) {
      return { serverError: 'Ошибка сервера: ' + error.message };
    }
  }


  @Post('createOrder')
  async createOrder(@Body() bodyData: Iorder) {
    try {
      let strInsertData = '';
      const nowDate = new Date();
      const d = `${nowDate.getFullYear()}-${nowDate.getMonth()}-${nowDate.getDate()}`;
      if (bodyData.mainData.shipment === '') {
        strInsertData = `INSERT INTO machines (order_machine, number_machine, name_machine, description, started, idcustomer, idcategory, weight) VALUES ('${bodyData.mainData.order_machine}', '${bodyData.mainData.number_machine}', '${bodyData.mainData.name_machine}', '${bodyData.mainData.description}', '${d}', '${bodyData.mainData.idcustomer}', '${bodyData.mainData.idcategory}', '${bodyData.mainData.weight}' )`;
      } else {
        strInsertData = `INSERT INTO machines (order_machine, number_machine, name_machine, description, started, idcustomer, idcategory, shipment, weight) VALUES ('${bodyData.mainData.order_machine}', '${bodyData.mainData.number_machine}', '${bodyData.mainData.name_machine}', '${bodyData.mainData.description}', '${d}', '${bodyData.mainData.idcustomer}', '${bodyData.mainData.idcategory}', '${bodyData.mainData.shipment}', '${bodyData.mainData.weight}' )`;
      }
      const insertMain = await this.appService.query(strInsertData);
      if (insertMain[0][0]['affectedRows'] === 1) {
        let insertStringProps = '';
        if (bodyData.insertProps.length > 0) {
          for (const item of bodyData.insertProps) {
            insertStringProps = insertStringProps + `('${item.order_machine}', '${item.property}', '${item.val}'),`;
          }
          insertStringProps = `INSERT INTO osk.machineproperties (order_machine, property, val) VALUES ${insertStringProps.slice(0, insertStringProps.length - 1)};`;
          const props = await this.appService.query(insertStringProps);
        }
      }
      return { response: 'ok' };
    } catch (error) {
            if (
        error.message ===
        `Duplicate entry '${bodyData.mainData.order_machine}' for key 'machines.PRIMARY'`
      ) {
        return { serverError: `Изделие с номером '${bodyData.mainData.order_machine}' уже существует` };
      } else {
        return { serverError: 'Ошибка сервера: ' + error.message };
      }
    }
  }

  @Put('saveOrder')
  async updateOrder(@Body() bodyData: Iorder) {
    try {
      if (bodyData.mainData.oldNameOrder !== bodyData.mainData.order_machine) {
        const canUpdate = await this.appService.query(`SELECT order_machine FROM osk.machines WHERE order_machine='${bodyData.mainData.order_machine}' LIMIT 1`,);
        if (canUpdate[0][0][0] !== undefined) {
          return { response: 'notUpdated' };
        }
      }
      await this.appService.query(`DELETE FROM osk.machineproperties WHERE order_machine='${bodyData.mainData.oldNameOrder}';`)
      let strUpdateData = '';
      if (bodyData.mainData.shipment === null) {
        strUpdateData = `UPDATE osk.machines SET order_machine='${bodyData.mainData.order_machine}', number_machine='${bodyData.mainData.number_machine}', name_machine='${bodyData.mainData.name_machine}', description='${bodyData.mainData.description}', shipment=${bodyData.mainData.shipment}, idcustomer='${bodyData.mainData.idcustomer}', idcategory='${bodyData.mainData.idcategory}', weight='${bodyData.mainData.weight}' WHERE order_machine='${bodyData.mainData.oldNameOrder}' AND isClosed=0; `;
      } else {
        strUpdateData = `UPDATE osk.machines SET order_machine='${bodyData.mainData.order_machine}', number_machine='${bodyData.mainData.number_machine}', name_machine='${bodyData.mainData.name_machine}', description='${bodyData.mainData.description}', shipment='${bodyData.mainData.shipment}', idcustomer='${bodyData.mainData.idcustomer}', idcategory='${bodyData.mainData.idcategory}', weight='${bodyData.mainData.weight}' WHERE order_machine='${bodyData.mainData.oldNameOrder}' AND isClosed=0; `;
      }
      const updateMain = await this.appService.query(strUpdateData);
      let insertStringProps = '';
      if (bodyData.insertProps.length > 0) {
        for (const item of bodyData.insertProps) {
          insertStringProps = insertStringProps + `('${item.order_machine}', '${item.property}', '${item.val}'),`;
        }
        insertStringProps = `INSERT INTO osk.machineproperties (order_machine, property, val) VALUES ${insertStringProps.slice(0, insertStringProps.length - 1)};`;
         await this.appService.query(insertStringProps);
      }
      if (updateMain[0][0]['affectedRows'] > 0) {
        return { response: 'ok' };
      }

    } catch (error) {
       return { serverError: 'Ошибка сервера: ' + error.message };
    }
  }



}
