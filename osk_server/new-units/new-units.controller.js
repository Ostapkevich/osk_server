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
exports.NewUnitsController = void 0;
const common_1 = require("@nestjs/common");
const app_service_1 = require("../app.service");
let NewUnitsController = class NewUnitsController {
    constructor(appService) {
        this.appService = appService;
    }
    async loadOrderAndUnits(id) {
        try {
            const order = await this.appService.execute(`SELECT order_machine, number_machine, name_machine, customers.customer 
      FROM machines JOIN customers ON machines.idcustomer=customers.idcustomer WHERE order_machine=? AND isClosed=0;`, [id]);
            if (order[0].length === 0) {
                return order[0];
            }
            else {
                const units = await this.appService.execute(`SELECT id_unit,unit, number_unit, name_unit, idauthor, status_unit, weight, DATE_FORMAT(started, '%Y-%m-%d') AS started,
       DATE_FORMAT(finished, '%Y-%m-%d') AS finished , users.nameUser FROM units LEFT JOIN users ON units.idauthor=users.iduser WHERE order_machine=? ORDER BY ind;`, [id]);
                return [{ order: order[0], units: units[0] }];
            }
        }
        catch (error) {
            return { serverError: error.message };
        }
    }
    async getUnits(id) {
        try {
            const data = await this.appService.query(`SELECT id_unit,unit, number_unit, name_unit, idauthor, status_unit, weight, DATE_FORMAT(started, '%Y-%m-%d') AS started , DATE_FORMAT(finished, '%Y-%m-%d') AS finished , users.nameUser FROM units LEFT JOIN users ON units.idauthor=users.iduser WHERE order_machine='${id}' ORDER BY ind;`);
            return data[0][0];
        }
        catch (error) {
            return { serverError: error.message };
        }
    }
    async isEmptyUnit(id) {
        try {
            const data = await this.appService.execute(`SELECT id_unit FROM unit_consist WHERE id_unit=? LIMIT 1;`, [id]);
            return data[0];
        }
        catch (error) {
            return { serverError: error.message };
        }
    }
    async deleteUnit(sp, order) {
        try {
            await this.appService.execute(`DELETE FROM units WHERE id_unit=?;`, [sp]);
            const data = await this.appService.execute(`SELECT id_unit,unit, number_unit, name_unit, idauthor, status_unit, weight, DATE_FORMAT(started, '%Y-%m-%d') AS started , DATE_FORMAT(finished, '%Y-%m-%d') AS finished , users.nameUser FROM units LEFT JOIN users ON units.idauthor=users.iduser WHERE order_machine=? ORDER BY ind;`, [order]);
            return data[0];
        }
        catch (error) {
            return { serverError: error.message };
        }
    }
    async saveUnits(id, bodyData) {
        try {
            let updateInsertString = '';
            for (const item of bodyData) {
                updateInsertString =
                    updateInsertString +
                        `(${item.id_specification}, '${item.order_machine}', '${item.ind}', '${item.name_unit}', '${item.number_unit}', '${item.unit}', ${item.weight}),`;
            }
            updateInsertString = `INSERT INTO osk.units (id_unit, order_machine, ind, name_unit, number_unit, unit, weight)
  VALUES ${updateInsertString.slice(0, updateInsertString.length - 1)}
  ON DUPLICATE KEY UPDATE
   ind=VALUES(ind),
   name_unit=VALUES(name_unit),
   number_unit=VALUES(number_unit),  
   unit=VALUES(unit),
   weight=VALUES (weight);`;
            await this.appService.query(updateInsertString);
            const data = await this.appService.execute(`SELECT id_unit,unit, number_unit, name_unit, idauthor, status_unit, weight, DATE_FORMAT(started, '%Y-%m-%d') AS started , DATE_FORMAT(finished, '%Y-%m-%d') AS finished , users.nameUser FROM units LEFT JOIN users ON units.idauthor=users.iduser WHERE order_machine=? ORDER BY ind;`, [id]);
            return data[0];
        }
        catch (error) {
            return { serverError: error.message };
        }
    }
};
__decorate([
    (0, common_1.Get)('getOrderAndUnits-:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NewUnitsController.prototype, "loadOrderAndUnits", null);
__decorate([
    (0, common_1.Get)('getUnits-:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NewUnitsController.prototype, "getUnits", null);
__decorate([
    (0, common_1.Get)('isEmptyUnit-:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], NewUnitsController.prototype, "isEmptyUnit", null);
__decorate([
    (0, common_1.Delete)('deleteUnit'),
    __param(0, (0, common_1.Query)('q0')),
    __param(1, (0, common_1.Query)('q1')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], NewUnitsController.prototype, "deleteUnit", null);
__decorate([
    (0, common_1.Put)('saveUnits-:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], NewUnitsController.prototype, "saveUnits", null);
NewUnitsController = __decorate([
    (0, common_1.Controller)('/editUnits'),
    __metadata("design:paramtypes", [app_service_1.AppService])
], NewUnitsController);
exports.NewUnitsController = NewUnitsController;
//# sourceMappingURL=new-units.controller.js.map