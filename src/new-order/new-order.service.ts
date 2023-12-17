import { Injectable } from '@nestjs/common';
import { AppService } from 'src/app.service';
import { NewOrderDTO } from './dto/new-order.dto';
import { EditedOrderDTO } from './dto/edited-order.dto';

@Injectable()
export class NewOrderService {
   constructor(private appService:AppService) {   
  }

   async createOrder(bodyData: NewOrderDTO) {
    let strCharacteristics = '';
    let strInsertData = '';
    try {
      for (let i = 0; i < 14; i++) {
        if (
          Object.prototype.hasOwnProperty.call(bodyData, 'char' + i) &&
          bodyData['char' + i] !== ''
        ) {
          strCharacteristics =
            strCharacteristics +
            `('${bodyData.order_machine}', '${bodyData['char' + i]}', '${bodyData['val' + i]
            }'),`;
        }
      }
      const nowDate = new Date();
      const d = `${nowDate.getFullYear()}-${nowDate.getMonth()}-${nowDate.getDate()}`;
      if (bodyData.shipment === '') {
        strInsertData = `INSERT INTO machines (order_machine, number_machine, name_machine, description, started, idcustomer, idcategory) VALUES ('${bodyData.order_machine}', '${bodyData.number_machine}', '${bodyData.name_machine}', '${bodyData.description}', '${d}', '${bodyData.idcustomer}', '${bodyData.idcategory}' )`;
      } else {
        strInsertData = `INSERT INTO machines (order_machine, number_machine, name_machine, description, started, idcustomer, idcategory, shipment) VALUES ('${bodyData.order_machine}', '${bodyData.number_machine}', '${bodyData.name_machine}', '${bodyData.description}', '${d}', '${bodyData.idcustomer}', '${bodyData.idcategory}', '${bodyData.shipment}' )`;
      }
      const date = await this.appService.query(strInsertData);
      if (strCharacteristics.length > 0) {
        await this.appService.query(
          `INSERT INTO machineproperties (order_machine, property, val) VALUES ${strCharacteristics.slice(
            0,
            strCharacteristics.length - 1,
          )}`,
        );
      }
      if (date[0]['affectedRows'] === 1) {
        return {response:'ok'};
      } 
    } catch (error) {
      if (
        error.message ===
        `Duplicate entry '${bodyData.order_machine}' for key 'machines.PRIMARY'`
      ) {
        return  { serverError: `Изделие с номером '${bodyData.order_machine}' уже существует` };
      } else {
        return {serverError:error.message};
      }
    }
  }

 /*  async updateOrder(bodyData: EditedOrderDTO) {
    let updateInsertStringProps = '';
    let deleteStringProps = '';
    let strUpdateData = '';
    try {
      if (bodyData.updateInsertProps.length > 0) {
        for (const item of bodyData.updateInsertProps) {
          updateInsertStringProps =
            updateInsertStringProps +
            `(${item.idproperty},'${item.order_machine}', '${item.property}', '${item.val}'),`;
        }
        updateInsertStringProps = `INSERT INTO osk.machineproperties (idproperty,order_machine, property, val)
        VALUES ${updateInsertStringProps.slice(
          0,
          updateInsertStringProps.length - 1,
        )}
        ON DUPLICATE KEY UPDATE
         property= VALUES(property),
         val=VALUES(val);`;
      }
      if (bodyData.deleteProps.length > 0) {
        for (const item of bodyData.deleteProps) {
          deleteStringProps = deleteStringProps + `${item.idproperty},`;
        }
        deleteStringProps = deleteStringProps.slice(
          0,
          deleteStringProps.length - 1,
        );
        deleteStringProps = `DELETE FROM osk.machineproperties WHERE idproperty IN (${deleteStringProps});`;
      }

      if (bodyData.mainData.shipment === null) {
        strUpdateData = `UPDATE osk.machines SET order_machine='${bodyData.mainData.order_machine}', number_machine='${bodyData.mainData.number_machine}', name_machine='${bodyData.mainData.name_machine}', description='${bodyData.mainData.description}', shipment=${bodyData.mainData.shipment}, idcustomer='${bodyData.mainData.idcustomer}', idcategory='${bodyData.mainData.idcategory}' WHERE order_machine='${bodyData.mainData.oldNameOrder}' AND isClosed=0; `;
      } else {
        strUpdateData = `UPDATE osk.machines SET order_machine='${bodyData.mainData.order_machine}', number_machine='${bodyData.mainData.number_machine}', name_machine='${bodyData.mainData.name_machine}', description='${bodyData.mainData.description}', shipment='${bodyData.mainData.shipment}', idcustomer='${bodyData.mainData.idcustomer}', idcategory='${bodyData.mainData.idcategory}' WHERE order_machine='${bodyData.mainData.oldNameOrder}' AND isClosed=0; `;
      }

      if (bodyData.mainData.oldNameOrder !== bodyData.mainData.order_machine) {
        const canUpdate = await this.appService.query(
          `SELECT order_machine FROM osk.machines WHERE order_machine='${bodyData.mainData.order_machine}' LIMIT 1`,
        );
        if (canUpdate[0][0] !== undefined) {
          return {response:'notUpdated'};
        }
      }

      const updateMain = await this.appService.query(strUpdateData);
      if (deleteStringProps.length > 0) {
        await this.appService.query(deleteStringProps);
      }
      if (updateInsertStringProps.length > 0) {
        await this.appService.query(updateInsertStringProps);
      }
      if (updateMain[0]['affectedRows'] > 0) {
        return {response:'updated'};
      } 
    } catch (error) {
      return {serverError:error.message} ;
    }
  }
 */
  async selectCustCat() {
    try {
      const customers = await this.appService.query(
        'SELECT idcustomer, customer FROM customers',
      );
      const categories = await this.appService.query(
        'SELECT idcategory, category FROM machines_categories',
      );
      return { customers: customers[0], categories: categories[0] };

    } catch (error) {
      return { serverError: error.message };
    }
  }

  async loadNewOrder(id: string) {
    try {
      const newOrder = await this.appService.query(
        `SELECT machines.order_machine, machines.number_machine, machines.name_machine, machines.description, DATE_FORMAT(shipment, '%Y-%m-%d')AS shipment, idcustomer, idcategory FROM machines WHERE machines.isClosed='0' AND machines.order_machine = '${id}' `,
      );
      return newOrder[0][0];
    } catch (error) {
      return { serverError: error.message };
    }
  }

  async loadAnalogOrder(id: string) {
    try {
      const analogOrder = await this.appService.query(
        `SELECT machines.number_machine, machines.name_machine, machines.description, idcategory FROM machines WHERE machines.order_machine = '${id}' `,
      );
      return analogOrder[0][0];
    } catch (error) {
      return { serverError: error.message };
    }
  }

  async getOrderDescription(id: string) {
    try {
      const analog = await this.appService.query(
        `SELECT machineproperties.idproperty, machineproperties.property, machineproperties.val FROM machineproperties WHERE machineproperties.order_machine = '${id}' `,
      );
      return analog[0];
    } catch (error) {
      return { serverError: error.message };
    }
  }
}
