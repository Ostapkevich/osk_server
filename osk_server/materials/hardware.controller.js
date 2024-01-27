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
exports.HardwareController = void 0;
const common_1 = require("@nestjs/common");
const app_service_1 = require("../app.service");
let HardwareController = class HardwareController {
    constructor(appService) {
        this.appService = appService;
    }
    async onLoad() {
        try {
            const hardware_type = 'SELECT id_type, name_type, ind FROM hardware_type ORDER BY ind;';
            const steels = 'SELECT idsteel, steel, ind FROM steels ORDER BY ind';
            const hardwares = 'SELECT id_item, name_item, d, L, steels.steel, weight FROM hardware JOIN steels ON hardware.idsteel=steels.idsteel JOIN hardware_type ON hardware.id_type=hardware_type.id_type  ORDER BY hardware_type.ind, d, L, steels.ind LIMIT 0,20 ;';
            const data = await this.appService.query(hardware_type, steels, hardwares);
            return { hardware_type: data[0][0], steels: data[1][0], hardwares: data[2][0] };
        }
        catch (error) {
            return { serverError: error.message };
        }
    }
    async deleteUnit(id) {
        try {
            const data = await this.appService.execute(`DELETE FROM hardware WHERE id_item=?;`, [id]);
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
                        sql = `SELECT id_item, name_item, d, L, steels.steel, weight FROM hardware JOIN steels ON hardware.idsteel=steels.idsteel JOIN hardware_type ON hardware.id_type=hardware_type.id_type WHERE ${str} ORDER BY hardware_type.ind, d, L, steels.ind LIMIT ${position},20;`;
                    }
                    else {
                        sql = `SELECT id_item, name_item, d, L, steels.steel, weight FROM hardware JOIN steels ON hardware.idsteel=steels.idsteel JOIN hardware_type ON hardware.id_type=hardware_type.id_type  ORDER BY hardware_type.ind, d, L, steels.ind LIMIT ${position},20;`;
                    }
                }
                else {
                    if (str.length > 0) {
                        sql = `SELECT id_item, name_item, d, L, steels.steel, weight FROM hardware JOIN steels ON hardware.idsteel=steels.idsteel JOIN hardware_type ON hardware.id_type=hardware_type.id_type WHERE hardware.idsteel=${steel} AND ${str} ORDER BY hardware_type.ind, d, L, steels.ind LIMIT ${position},20;`;
                    }
                    else {
                        sql = `SELECT id_item, name_item, d, L, steels.steel, weight FROM hardware JOIN steels ON hardware.idsteel=steels.idsteel JOIN hardware_type ON hardware.id_type=hardware_type.id_type WHERE hardware.idsteel=${steel}  ORDER BY hardware_type.ind, d, L, steels.ind LIMIT ${position},20;`;
                    }
                }
            }
            else {
                if (+steel === -1) {
                    if (str.length > 0) {
                        sql = `SELECT id_item, name_item, d, L, steels.steel, weight FROM hardware JOIN steels ON hardware.idsteel=steels.idsteel JOIN hardware_type ON hardware.id_type=hardware_type.id_type WHERE hardware.id_type=${rolledtype} AND ${str} ORDER BY hardware_type.ind, d, L, steels.ind LIMIT ${position},20;`;
                    }
                    else {
                        sql = `SELECT id_item, name_item, d, L, steels.steel, weight FROM hardware JOIN steels ON hardware.idsteel=steels.idsteel JOIN hardware_type ON hardware.id_type=hardware_type.id_type WHERE hardware.id_type=${rolledtype}  ORDER BY hardware_type.ind, d, L, steels.ind LIMIT ${position},20;`;
                    }
                }
                else {
                    if (str.length > 0) {
                        sql = `SELECT id_item, name_item, d, L, steels.steel, weight FROM hardware JOIN steels ON hardware.idsteel=steels.idsteel JOIN hardware_type ON hardware.id_type=hardware_type.id_type WHERE hardware.id_type=${rolledtype} AND hardware.idsteel=${steel} AND ${str} ORDER BY hardware_type.ind, d, L, steels.ind LIMIT ${position},20;`;
                    }
                    else {
                        sql = `SELECT id_item, name_item, d, L, steels.steel, weight FROM hardware JOIN steels ON hardware.idsteel=steels.idsteel JOIN hardware_type ON hardware.id_type=hardware_type.id_type WHERE hardware.id_type=${rolledtype} AND hardware.idsteel=${steel}  ORDER BY hardware_type.ind, d, L, steels.ind LIMIT ${position},20;`;
                    }
                }
            }
            const hardwaresData = await this.appService.query(sql);
            return { hardwares: hardwaresData[0][0] };
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
            strInsertData = `INSERT hardware (id_type, idsteel, name_item, d, weight, L) VALUES (?,?,?,?,?,?)`;
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
            const strUpdateData = `UPDATE hardware SET name_item=?, d=?, weight=?, L=? WHERE id_item=?`;
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
], HardwareController.prototype, "onLoad", null);
__decorate([
    (0, common_1.Delete)('deleteHardware'),
    __param(0, (0, common_1.Query)('q0')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], HardwareController.prototype, "deleteUnit", null);
__decorate([
    (0, common_1.Get)('getHardware/:rolledtype/:steel/:position'),
    __param(0, (0, common_1.Param)('rolledtype')),
    __param(1, (0, common_1.Param)('steel')),
    __param(2, (0, common_1.Param)('position')),
    __param(3, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number, Object]),
    __metadata("design:returntype", Promise)
], HardwareController.prototype, "loadRolled", null);
__decorate([
    (0, common_1.Post)('addHardware'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], HardwareController.prototype, "createRolled", null);
__decorate([
    (0, common_1.Put)('updateHardware'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], HardwareController.prototype, "updateRolled", null);
HardwareController = __decorate([
    (0, common_1.Controller)('/hardware'),
    __metadata("design:paramtypes", [app_service_1.AppService])
], HardwareController);
exports.HardwareController = HardwareController;
//# sourceMappingURL=hardware.controller.js.map