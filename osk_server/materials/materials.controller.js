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
exports.MaterailsController = void 0;
const common_1 = require("@nestjs/common");
const app_service_1 = require("../app.service");
let MaterailsController = class MaterailsController {
    constructor(appService) {
        this.appService = appService;
    }
    async onLoad() {
        try {
            const material_type = `SELECT id_type, name_type, ind FROM material_type ORDER BY ind;`;
            const materials = `SELECT id_item, name_item, x1, x2, units, specific_units, percent FROM material JOIN material_type ON material.id_type=material_type.id_type ORDER BY material_type.ind, x1, x2 LIMIT 0,20;`;
            const data = await this.appService.query(material_type, materials);
            return { material_type: data[0][0], materials: data[1][0] };
        }
        catch (error) {
            return { serverError: error.message };
        }
    }
    async getUseLenth(id) {
        try {
            const sql = `SELECT uselength FROM rolled_type where id_type in (select id_type from rolled where id_item=${id}) ;`;
            const data = await this.appService.query(sql);
            return { useLenth: data[0][0] };
        }
        catch (error) {
            return { serverError: error.message };
        }
    }
    async deleteUnit(id) {
        try {
            const data = await this.appService.execute(`DELETE FROM material WHERE id_item=?;`, [id]);
            if (data[0]['affectedRows'] === 1) {
                return { response: 'ok' };
            }
        }
        catch (error) {
            if (error.errno === 1451) {
                return { serverError: 'Удаление невозможно! В базе имеются данные, использующие данную позицию!' };
            }
            else {
                return { serverError: 'Ошибка сервера: ' + error.message };
            }
        }
    }
    async loadRolled(materialtype, position, bodyData) {
        try {
            let str = ``;
            if (bodyData.hasOwnProperty('sql0')) {
                str = str + `name_item LIKE '%${bodyData.sql0}%' `;
            }
            let sql;
            if (+materialtype === -1) {
                if (str.length > 0) {
                    sql = `SELECT id_item, name_item, x1, x2, units, specific_units, percent FROM material JOIN material_type ON material.id_type=material_type.id_type WHERE ${str} ORDER BY material_type.ind, x1, x2 LIMIT ${position},20;`;
                }
                else {
                    sql = `SELECT id_item, name_item, x1, x2, units, specific_units, percent FROM material JOIN material_type ON material.id_type=material_type.id_type ORDER BY material_type.ind, x1, x2 LIMIT ${position},20;`;
                }
            }
            else {
                if (str.length > 0) {
                    sql = `SELECT id_item, name_item, x1, x2, units, specific_units, percent FROM material JOIN material_type ON material.id_type=material_type.id_type WHERE material.id_type=${materialtype} AND ${str} ORDER BY material_type.ind, x1, x2 LIMIT ${position},20;`;
                }
                else {
                    sql = `SELECT id_item, name_item, x1, x2, units, specific_units, percent FROM material JOIN material_type ON material.id_type=material_type.id_type  WHERE material.id_type=${materialtype}  ORDER BY material_type.ind, x1, x2 LIMIT ${position},20;`;
                }
            }
            const materialData = await this.appService.query(sql);
            return { materials: materialData[0][0] };
        }
        catch (error) {
            console.log(error);
            return { serverError: error.message };
        }
    }
    async createRolled(bodyData) {
        try {
            let strInsertData = '';
            let arrData = [];
            for (const key in bodyData) {
                if (Object.prototype.hasOwnProperty.call(bodyData, key)) {
                    let param = bodyData[key];
                    arrData.push(param);
                }
            }
            strInsertData = `INSERT material (id_type, name_item, x1, x2, units, specific_units, percent) VALUES (?,?,?,?,?,?,?)`;
            const insertMain = await this.appService.execute(strInsertData, arrData);
            if (insertMain[0]['affectedRows'] === 1) {
                return { response: 'ok' };
            }
        }
        catch (error) {
            console.log(error);
            return { serverError: 'Ошибка сервера: ' + error.message };
        }
    }
    async updateRolled(bodyData) {
        try {
            let arrData = [];
            for (const key in bodyData) {
                if (Object.prototype.hasOwnProperty.call(bodyData, key)) {
                    let param = bodyData[key];
                    arrData.push(param);
                }
            }
            const strUpdateData = `UPDATE material SET name_item=?, x1=?, x2=?, units=?, specific_units=?, percent=? WHERE id_item=?`;
            const data = await this.appService.execute(strUpdateData, arrData);
            if (data[0]['affectedRows'] === 1) {
                return { response: 'ok' };
            }
        }
        catch (error) {
            return { serverError: 'Ошибка сервера: ' + error.message };
        }
    }
};
__decorate([
    (0, common_1.Get)('onLoad'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MaterailsController.prototype, "onLoad", null);
__decorate([
    (0, common_1.Get)('getUseLenth/:id'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], MaterailsController.prototype, "getUseLenth", null);
__decorate([
    (0, common_1.Delete)('deleteMaterial'),
    __param(0, (0, common_1.Query)('q0')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MaterailsController.prototype, "deleteUnit", null);
__decorate([
    (0, common_1.Get)('getMaterial/:materialtype/:position'),
    __param(0, (0, common_1.Param)('materialtype')),
    __param(1, (0, common_1.Param)('position')),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object]),
    __metadata("design:returntype", Promise)
], MaterailsController.prototype, "loadRolled", null);
__decorate([
    (0, common_1.Post)('addMaterial'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MaterailsController.prototype, "createRolled", null);
__decorate([
    (0, common_1.Put)('updateMaterial'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MaterailsController.prototype, "updateRolled", null);
MaterailsController = __decorate([
    (0, common_1.Controller)('/materials'),
    __metadata("design:paramtypes", [app_service_1.AppService])
], MaterailsController);
exports.MaterailsController = MaterailsController;
//# sourceMappingURL=materials.controller.js.map