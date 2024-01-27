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
exports.TypeMaterialsController = void 0;
const common_1 = require("@nestjs/common");
const app_service_1 = require("../app.service");
let TypeMaterialsController = class TypeMaterialsController {
    constructor(appService) {
        this.appService = appService;
    }
    async loadTypes(table) {
        try {
            let sql = '';
            switch (table) {
                case 'rolled_type':
                    sql = `SELECT id_type, name_type, ind, uselength FROM ${table} WHERE id_type <> 1 ORDER BY ind;`;
                    break;
                case 'hardware_type':
                    sql = `SELECT id_type, name_type, ind FROM ${table} WHERE id_type <> 1 ORDER BY ind;`;
                    break;
                case 'material_type':
                    sql = `SELECT id_type, name_type, ind FROM ${table} WHERE id_type <> 1 ORDER BY ind;`;
                    break;
                case 'purchased_type':
                    sql = `SELECT id_type, name_type, ind FROM ${table} WHERE id_type <> 1 ORDER BY ind;`;
            }
            const typesMaterialData = await this.appService.query(sql);
            return { typesMaterial: typesMaterialData[0][0] };
        }
        catch (error) {
            return { serverError: 'Ошибка сервера:' + error.message };
        }
    }
    async saveUnits(table, bodyData) {
        try {
            let updateInsertString = '';
            for (const item of bodyData) {
                updateInsertString =
                    updateInsertString +
                        `(${item.id_type}, '${item.name_type}', ${item.ind}, ${item.uselength}),`;
            }
            updateInsertString = `INSERT INTO osk.${table} (id_type, name_type, ind, uselength)
    VALUES ${updateInsertString.slice(0, updateInsertString.length - 1)}
    ON DUPLICATE KEY UPDATE
     name_type=VALUES(name_type),
     ind=VALUES(ind),
     uselength=VALUES(uselength);`;
            await this.appService.query(updateInsertString);
            const data = this.loadTypes(table);
            return (data);
        }
        catch (error) {
            return { serverError: error.message };
        }
    }
    async opdate(table, bodyData) {
        try {
            let arrData = [];
            for (const key in bodyData) {
                if (Object.prototype.hasOwnProperty.call(bodyData, key)) {
                    let param = bodyData[key];
                    arrData.push(param);
                }
            }
            let sql = '';
            switch (table) {
                case 'rolled_type':
                    sql = `UPDATE ${table} SET name_type=?, uselength=? WHERE id_type=?;`;
                    break;
                default:
                    break;
            }
            const data = await this.appService.execute(sql, arrData);
            if (data[0]['affectedRows'] === 1) {
                const data = this.loadTypes(table);
                return (data);
            }
        }
        catch (error) {
            return { serverError: 'Ошибка сервера: ' + error.message };
        }
    }
    async delete(table, id) {
        try {
            let sql = `DELETE FROM ${table} WHERE id_type=?;`;
            const data = await this.appService.execute(sql, [id]);
            if (data[0]['affectedRows'] === 1) {
                const data = this.loadTypes(table);
                return (data);
            }
        }
        catch (error) {
            if (error.errno === 1451) {
                return { serverError: 'Нельзя удалить данный тип материала, поскольку в базе имееются данные, связанные с этим типом! ' };
            }
            else {
                return { serverError: 'Ошибка сервера: ' + error.message };
            }
        }
    }
};
__decorate([
    (0, common_1.Get)('getTypes/:table'),
    __param(0, (0, common_1.Param)('table')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TypeMaterialsController.prototype, "loadTypes", null);
__decorate([
    (0, common_1.Put)('saveTypes/:table'),
    __param(0, (0, common_1.Param)('table')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TypeMaterialsController.prototype, "saveUnits", null);
__decorate([
    (0, common_1.Put)('update/:table'),
    __param(0, (0, common_1.Param)('table')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TypeMaterialsController.prototype, "opdate", null);
__decorate([
    (0, common_1.Delete)('deleteType/:table/:id'),
    __param(0, (0, common_1.Param)('table')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], TypeMaterialsController.prototype, "delete", null);
TypeMaterialsController = __decorate([
    (0, common_1.Controller)('types'),
    __metadata("design:paramtypes", [app_service_1.AppService])
], TypeMaterialsController);
exports.TypeMaterialsController = TypeMaterialsController;
//# sourceMappingURL=type-materials.controller.js.map