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
exports.RolledController = void 0;
const common_1 = require("@nestjs/common");
const app_service_1 = require("../app.service");
let RolledController = class RolledController {
    constructor(appService) {
        this.appService = appService;
    }
    async onLoad() {
        try {
            const rolled_type = 'SELECT id_type, name_type, ind, uselength FROM rolled_type ORDER BY ind;';
            const steels = 'SELECT idsteel, steel, ind FROM steels ORDER BY ind';
            const rolleds = 'SELECT id_item, name_item, d, t, steels.steel, weight, rolled_type.uselength FROM rolled JOIN steels ON rolled.idsteel=steels.idsteel JOIN rolled_type ON rolled_type.id_type=rolled.id_type ORDER BY rolled_type.ind, d, t, steels.ind LIMIT 0,20;';
            const data = await this.appService.query(rolled_type, steels, rolleds);
            return { rolled_type: data[0][0], steels: data[1][0], rolleds: data[2][0] };
        }
        catch (error) {
            return { serverError: error.message };
        }
    }
    async deleteUnit(id) {
        try {
            const data = await this.appService.execute(`DELETE FROM rolled WHERE id_item=?;`, [id]);
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
    async loadRolled(rolledtype, steel, position, bodyData) {
        try {
            let str = ``;
            if (bodyData.hasOwnProperty('sql0')) {
                str = str + `name_item LIKE '%${bodyData.sql0}%' `;
            }
            let sql;
            if (+rolledtype === -1) {
                if (+steel === -1) {
                    if (str.length > 0) {
                        sql = `SELECT id_item, name_item, d, t, steels.steel, weight, rolled_type.uselength FROM rolled JOIN steels ON rolled.idsteel=steels.idsteel JOIN rolled_type ON rolled_type.id_type=rolled.id_type  WHERE ${str} ORDER BY rolled_type.ind, d, t, steels.ind LIMIT ${position},20;`;
                    }
                    else {
                        sql = `SELECT id_item, name_item, d, t, steels.steel, weight, rolled_type.uselength FROM rolled JOIN steels ON rolled.idsteel=steels.idsteel JOIN rolled_type ON rolled_type.id_type=rolled.id_type ORDER BY rolled_type.ind, d, t, steels.ind LIMIT ${position},20;`;
                    }
                }
                else {
                    if (str.length > 0) {
                        sql = `SELECT id_item, name_item, d, t, steels.steel, weight, rolled_type.uselength FROM rolled JOIN steels ON rolled.idsteel=steels.idsteel JOIN rolled_type ON rolled_type.id_type=rolled.id_type WHERE rolled.idsteel=${steel} AND ${str} ORDER BY rolled_type.ind, d, t, steels.ind LIMIT ${position},20;`;
                    }
                    else {
                        sql = `SELECT id_item, name_item, d, t, steels.steel, weight, rolled_type.uselength FROM rolled JOIN steels ON rolled.idsteel=steels.idsteel JOIN rolled_type ON rolled_type.id_type=rolled.id_type WHERE rolled.idsteel=${steel}  ORDER BY rolled_type.ind, d, t, steels.ind LIMIT ${position},20;`;
                    }
                }
            }
            else {
                if (+steel === -1) {
                    if (str.length > 0) {
                        sql = `SELECT id_item, name_item, d, t, steels.steel, weight, rolled_type.uselength FROM rolled JOIN steels ON rolled.idsteel=steels.idsteel JOIN rolled_type ON rolled_type.id_type=rolled.id_type WHERE rolled.id_type=${rolledtype} AND ${str} ORDER BY rolled_type.ind, d, t, steels.ind LIMIT ${position},20;`;
                    }
                    else {
                        sql = `SELECT id_item, name_item, d, t, steels.steel, weight, rolled_type.uselength FROM rolled JOIN steels ON rolled.idsteel=steels.idsteel JOIN rolled_type ON rolled_type.id_type=rolled.id_type WHERE rolled.id_type=${rolledtype}  ORDER BY rolled_type.ind, d, t, steels.ind LIMIT ${position},20;`;
                    }
                }
                else {
                    if (str.length > 0) {
                        sql = `SELECT id_item, name_item, d, t, steels.steel, weight, rolled_type.uselength FROM rolled JOIN steels ON rolled.idsteel=steels.idsteel JOIN rolled_type ON rolled_type.id_type=rolled.id_type WHERE rolled.id_type=${rolledtype} AND rolled.idsteel=${steel} AND ${str} ORDER BY rolled_type.ind, d, t, steels.ind LIMIT ${position},20;`;
                    }
                    else {
                        sql = `SELECT id_item, name_item, d, t, steels.steel, weight, rolled_type.uselength FROM rolled JOIN steels ON rolled.idsteel=steels.idsteel JOIN rolled_type ON rolled_type.id_type=rolled.id_type WHERE rolled.id_type=${rolledtype} AND rolled.idsteel=${steel}  ORDER BY rolled_type.ind, d, t, steels.ind LIMIT ${position},20;`;
                    }
                }
            }
            const rolledsData = await this.appService.query(sql);
            return { rolleds: rolledsData[0][0] };
        }
        catch (error) {
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
            strInsertData = `INSERT rolled (id_type, idsteel, name_item, d, weight, t) VALUES (?,?,?,?,?,?)`;
            const insertMain = await this.appService.execute(strInsertData, arrData);
            if (insertMain[0]['affectedRows'] === 1) {
                return { response: 'ok' };
            }
        }
        catch (error) {
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
            const strUpdateData = `UPDATE rolled SET name_item=?, d=?, weight=?, t=? WHERE id_item=?`;
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
], RolledController.prototype, "onLoad", null);
__decorate([
    (0, common_1.Delete)('deleteRolled'),
    __param(0, (0, common_1.Query)('q0')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RolledController.prototype, "deleteUnit", null);
__decorate([
    (0, common_1.Get)('getRolled/:rolledtype/:steel/:position'),
    __param(0, (0, common_1.Param)('rolledtype')),
    __param(1, (0, common_1.Param)('steel')),
    __param(2, (0, common_1.Param)('position')),
    __param(3, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number, Object]),
    __metadata("design:returntype", Promise)
], RolledController.prototype, "loadRolled", null);
__decorate([
    (0, common_1.Post)('addRolled'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RolledController.prototype, "createRolled", null);
__decorate([
    (0, common_1.Put)('updateRolled'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RolledController.prototype, "updateRolled", null);
RolledController = __decorate([
    (0, common_1.Controller)('/rolled'),
    __metadata("design:paramtypes", [app_service_1.AppService])
], RolledController);
exports.RolledController = RolledController;
//# sourceMappingURL=rolled.controller.js.map