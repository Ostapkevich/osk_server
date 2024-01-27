"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewOrderController = void 0;
const common_1 = require("@nestjs/common");
const app_service_1 = require("../app.service");
let NewOrderController = class NewOrderController {
    constructor(appService) {
        this.appService = appService;
    }
    async getCustCat() {
        try {
            const sql1 = 'SELECT idcustomer, customer FROM customers';
            const sql2 = 'SELECT idcategory, category FROM machines_categories';
            const data = await this.appService.query(sql1, sql2);
            return { customers: data[0][0], categories: data[1][0] };
        }
        catch (error) {
            return { serverError: 'Ошибка сервера: ' + error.message };
        }
    }
    async getOrder(id, isAnalog) {
        try {
            let orderSQL = '';
            if (isAnalog === 'false') {
                orderSQL = `SELECT machines.order_machine, machines.number_machine, machines.name_machine, machines.description, DATE_FORMAT(shipment, '%Y-%m-%d')AS shipment, idcustomer, idcategory, weight FROM machines WHERE machines.isClosed='0' AND machines.order_machine = '${id}' `;
            }
            else {
                orderSQL = `SELECT machines.number_machine, machines.name_machine, machines.description, idcategory, weight FROM machines WHERE machines.order_machine = '${id}' `;
            }
            const propsSQL = `SELECT machineproperties.idproperty, machineproperties.property, machineproperties.val FROM machineproperties WHERE machineproperties.order_machine = '${id}' `;
            const data = await this.appService.query(orderSQL, propsSQL);
            return { order: data[0][0][0], properties: data[1][0] };
        }
        catch (error) {
            return { serverError: 'Ошибка сервера: ' + error.message };
        }
    }
    async createOrder(bodyData) {
        try {
            let strInsertData = '';
            const nowDate = new Date();
            const d = `${nowDate.getFullYear()}-${nowDate.getMonth()}-${nowDate.getDate()}`;
            if (bodyData.mainData.shipment === '') {
                strInsertData = `INSERT INTO machines (order_machine, number_machine, name_machine, description, started, idcustomer, idcategory, weight) VALUES ('${bodyData.mainData.order_machine}', '${bodyData.mainData.number_machine}', '${bodyData.mainData.name_machine}', '${bodyData.mainData.description}', '${d}', '${bodyData.mainData.idcustomer}', '${bodyData.mainData.idcategory}', '${bodyData.mainData.weight}' )`;
            }
            else {
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
        }
        catch (error) {
            if (error.message ===
                `Duplicate entry '${bodyData.mainData.order_machine}' for key 'machines.PRIMARY'`) {
                return { serverError: `Изделие с номером '${bodyData.mainData.order_machine}' уже существует` };
            }
            else {
                return { serverError: 'Ошибка сервера: ' + error.message };
            }
        }
    }
    async updateOrder(bodyData) {
        try {
            if (bodyData.mainData.oldNameOrder !== bodyData.mainData.order_machine) {
                const canUpdate = await this.appService.query(`SELECT order_machine FROM osk.machines WHERE order_machine='${bodyData.mainData.order_machine}' LIMIT 1`);
                if (canUpdate[0][0][0] !== undefined) {
                    return { response: 'notUpdated' };
                }
            }
            await this.appService.query(`DELETE FROM osk.machineproperties WHERE order_machine='${bodyData.mainData.oldNameOrder}';`);
            let strUpdateData = '';
            if (bodyData.mainData.shipment === null) {
                strUpdateData = `UPDATE osk.machines SET order_machine='${bodyData.mainData.order_machine}', number_machine='${bodyData.mainData.number_machine}', name_machine='${bodyData.mainData.name_machine}', description='${bodyData.mainData.description}', shipment=${bodyData.mainData.shipment}, idcustomer='${bodyData.mainData.idcustomer}', idcategory='${bodyData.mainData.idcategory}', weight='${bodyData.mainData.weight}' WHERE order_machine='${bodyData.mainData.oldNameOrder}' AND isClosed=0; `;
            }
            else {
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
        }
        catch (error) {
            return { serverError: 'Ошибка сервера: ' + error.message };
        }
    }
};
__decorate([
    (0, common_1.Get)('selectcustcat'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], NewOrderController.prototype, "getCustCat", null);
__decorate([
    (0, common_1.Get)('loadOrder:id/:isAnalog'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('isAnalog')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], NewOrderController.prototype, "getOrder", null);
__decorate([
    (0, common_1.Post)('createOrder'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NewOrderController.prototype, "createOrder", null);
__decorate([
    (0, common_1.Put)('saveOrder'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NewOrderController.prototype, "updateOrder", null);
NewOrderController = __decorate([
    (0, common_1.Controller)('/newOrder'),
    __metadata("design:paramtypes", [app_service_1.AppService])
], NewOrderController);
exports.NewOrderController = NewOrderController;
//# sourceMappingURL=new-order.controller.js.map