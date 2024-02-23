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
exports.CreateDrawingsController = void 0;
const common_1 = require("@nestjs/common");
const app_service_1 = require("../app.service");
const scan_service_1 = require("./scan.service");
const path = require("path");
const drawing_service_1 = require("./drawing.service");
let CreateDrawingsController = class CreateDrawingsController {
    constructor(appService, scanService, dravingSerice) {
        this.appService = appService;
        this.scanService = scanService;
        this.dravingSerice = dravingSerice;
    }
    async saveDrawing(bodyData) {
        try {
            const sqlDrawing = `INSERT INTO osk.drawings (idDrawing, numberDrawing, nameDrawing, weight, s, path) VALUES ( ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE idDrawing=VALUES(idDrawing), numberDrawing=VALUES(numberDrawing), nameDrawing=VALUES(nameDrawing), weight=VALUES(weight), s=VALUES(s), path=VALUES(path) ;`;
            const data = await this.appService.execute(sqlDrawing, bodyData);
            console.log(bodyData);
            console.log(data);
            return { response: data[0].insertId };
        }
        catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                return { serverError: 'Чертеж с таким номером уже существует!' };
            }
            else {
                return { serverError: error.message };
            }
        }
    }
    async saveBlank(typeBlank, bodyData) {
        try {
            let sqlBlank = '';
            if (+typeBlank === 1) {
                sqlBlank = `INSERT INTO osk.drawing_blank_rolled (id, idDrawing, id_item, L, d_b, h, plasma, allowance) VALUES (?,?, ?, ?, ?,?,?,?) ON DUPLICATE KEY UPDATE id=VALUES(id), idDrawing=VALUES(idDrawing), id_item=VALUES(id_item), L=VALUES(L), d_b=VALUES(d_b), h=values(h), plasma=VALUES(plasma), allowance=VALUES(allowance);`;
            }
            else if (+typeBlank === 2) {
                sqlBlank = `INSERT INTO osk.drawing_blank_hardware (id, idDrawing, id_item) VALUES (?,?,?) ON DUPLICATE KEY UPDATE id=VALUES(id), idDrawing=VALUES(idDrawing), id_item=VALUES(id_item);`;
            }
            else if (+typeBlank === 3) {
                sqlBlank = `INSERT INTO osk.drawing_blank_material (id, idDrawing, id_item, percent, value, specific_units, L, h) VALUES (?,?, ?, ?, ?, ?,?,?) ON DUPLICATE KEY UPDATE id=VALUES(id), idDrawing=VALUES(idDrawing), id_item=VALUES(id_item),  percent=VALUES(percent), value=VALUES(value), specific_units=VALUES(specific_units), L=VALUES(L), h=values(h);`;
            }
            else if (+typeBlank === 4) {
                sqlBlank = `INSERT INTO osk.drawing_blank_purshased (id, idDrawing, id_item) VALUES (?,?,?) ON DUPLICATE KEY UPDATE id=VALUES(id), idDrawing=VALUES(idDrawing), id_item=VALUES(id_item);`;
            }
            const data = await this.appService.execute(sqlBlank, bodyData);
            return { id: data[0].insertId };
        }
        catch (error) {
            return { serverError: error.message };
        }
    }
    async deleteBlank(typeBlank, id, idDrawing, newTypeBlank) {
        try {
            let oldTable = '';
            switch (+typeBlank) {
                case 1:
                    oldTable = 'drawing_blank_rolled';
                    break;
                case 2:
                    oldTable = 'drawing_blank_hardware';
                    break;
                case 3:
                    oldTable = 'drawing_blank_material';
                    break;
                case 4:
                    oldTable = 'drawing_blank_purshased';
                    break;
            }
            const data = await this.appService.query(`DELETE FROM ${oldTable} WHERE id=${id}`, `UPDATE drawings SET type_blank = ${newTypeBlank} WHERE idDrawing=${idDrawing} `);
            if (data[0][0].affectedRows && data[1][0].affectedRows) {
                return { response: 'ok' };
            }
        }
        catch (error) {
            return { serverError: error.message };
        }
    }
    async deleteMaterial(id) {
        try {
            const data = await this.appService.query(`DELETE FROM drawing_materials WHERE id=${id}`);
            console.log(data);
            if (data[0][0].affectedRows && data[0][0].affectedRows) {
                return { response: 'ok' };
            }
        }
        catch (error) {
            return { serverError: error.message };
        }
    }
    async addPositionSP(bodyData) {
        try {
            console.log('bodyData ', bodyData);
            let data = await this.appService.execute(`INSERT INTO drawing_specification (ind, idDrawing, type_position, quantity) VALUES (?,?,?,?)`, bodyData.dataSP);
            console.log('dataDetails befor ', bodyData.dataDetails);
            const idParent = data[0].insertId;
            bodyData.dataDetails.push(idParent);
            console.log('dataDetails after ', bodyData.dataDetails);
            let sqlPosition = '';
            const typePosition = bodyData.dataSP[2];
            if (typePosition === 1) {
                sqlPosition = `INSERT INTO osk.sprolled (id_sprolled, id_item, L, d_b, h, plasma, name, id) VALUES (?,?,?,?,?,?,?,?) ON DUPLICATE KEY UPDATE id_sprolled=VALUES(id_sprolled), id_item=VALUES(id_item), L=VALUES(L), d_b=VALUES(d_b), h=values(h), plasma=VALUES(plasma), name=VALUES(name), id=VALUES(id);`;
            }
            else if (typePosition === 2) {
                sqlPosition = `INSERT INTO osk.sphardware (id_sphardware, id_item, name, id) VALUES (?,?,?,?) ON DUPLICATE KEY UPDATE id_sphardware=VALUES(id_sphardware), id_item=VALUES(id_item), name=VALUES(name), id=VALUES(id);`;
            }
            else if (typePosition === 3) {
                sqlPosition = `INSERT INTO osk.spmaterial (id_spmaterial, id_item, percent, value, specific_units, L, h, name, id) VALUES (?,?,?,?,?,?,?,?,?) ON DUPLICATE KEY UPDATE id_spmaterial=VALUES(id_spmaterial), id_item=VALUES(id_item),  percent=VALUES(percent), value=VALUES(value), specific_units=VALUES(specific_units), L=VALUES(L), h=values(h), name=values(name), id=VALUES(id);`;
            }
            else if (typePosition === 4) {
                sqlPosition = `INSERT INTO osk.sppurshasered (id_sppurshasered, id_item, name, id) VALUES (?,?,?) ON DUPLICATE KEY UPDATE id_sppurshasered=VALUES(id_sppurshasered), id_item=VALUES(id_item), name=VALUES(name), id=VALUES(id);`;
            }
            else {
                sqlPosition = `INSERT INTO osk.spdrawing (id_spdrawing, idDrawing, id) VALUES (?,?,?) ON DUPLICATE KEY UPDATE id_spdrawing=VALUES(id_spdrawing), idDrawing=VALUES(idDrawing),id=VALUES(id);`;
            }
            data = await this.appService.execute(sqlPosition, bodyData.dataDetails);
            return { idParent: idParent, idChild: data[0].insertId };
        }
        catch (error) {
            console.log(error);
            return { serverError: error.message };
        }
    }
    async saveAll(typeBlank, bodyData) {
        var _a;
        try {
            let sqlBlank = '';
            let sqlMaterials = '';
            let sqlDrawings = '';
            let sqlSpecifications = '';
            let rolledSp = '';
            let hardwareSp = '';
            let materialSp = '';
            let purshSp = '';
            let drawSp = '';
            sqlDrawings = `INSERT INTO osk.drawings (idDrawing, numberDrawing, nameDrawing, weight, type_blank, s, path) VALUES ( ?, ?, ?, ?, ?, ?, ?);`;
            if (+typeBlank === 1) {
                sqlBlank = `INSERT INTO osk.drawing_blank_rolled (id, idDrawing, id_item, value, plasma,L, d_b, h, persent) VALUES (?,?, ?, ?, ?,?,?,?,?) ON DUPLICATE KEY UPDATE id=VALUES(id), idDrawing=VALUES(idDrawing), id_item=VALUES(id_item), value=VALUES(value), plasma=VALUES(plasma), L=VALUES(L), d_b=VALUES(d_b), h=values(h), percent=values(percent);`;
            }
            else if (+typeBlank === 2) {
                sqlBlank = `INSERT INTO osk.drawing_blank_hardware (id, idDrawing, id_item, value) VALUES (?,?, ?, ?) ON DUPLICATE KEY UPDATE id=VALUES(id), id_item=VALUES(idDrawing) id_item=VALUES(id_item);`;
            }
            else if (+typeBlank === 3) {
                sqlBlank = `INSERT INTO osk.drawing_blank_material (id, idDrawing, id_item, percent, value, specific_units, L, h) VALUES (?,?, ?, ?, ?, ?,?,?) ON DUPLICATE KEY UPDATE id=VALUES(id),id_item=VALUES(idDrawing), id_item=VALUES(id_item), percent=VALUES(percent), value=VALUES(value), specific_units=VALUES(specific_units), L=VALUES(L), h=values(h);`;
            }
            else if (+typeBlank === 4) {
                sqlBlank = `INSERT INTO osk.drawing_blank_purshased (id, idDrawing  , id_item) VALUES (?,?, ?, ?) ON DUPLICATE KEY UPDATE id=VALUES(id), id_item=VALUES(idDrawing) id_item=VALUES(id_item);`;
            }
            if (bodyData.materials) {
                for (let index = 0; index < bodyData.materials.length / 8; index++) {
                    sqlMaterials = sqlMaterials + '(?,?, ?, ?, ?, ?,?,?),';
                }
                sqlMaterials = sqlMaterials.slice(0, sqlMaterials.length - 1);
                sqlMaterials = `INSERT INTO osk.drawing_materials (id, idDrawing, id_item, percent, value, specific_units, L, h) VALUES ${sqlMaterials} ON DUPLICATE KEY UPDATE id=VALUES(id), id_item=VALUES(idDrawing), id_item=VALUES(id_item), percent=VALUES(percent), value=VALUES(value), specific_units=VALUES(specific_units), L=VALUES(L), h=values(h);`;
            }
            if (bodyData.specifications) {
                for (let index = 0; index < bodyData.specifications.length / 12; index++) {
                    sqlSpecifications = sqlSpecifications + '(?,?,?,?,?),';
                    switch (bodyData.type_position) {
                        case 1:
                            rolledSp = rolledSp + '(?,?,?,?,?,?),';
                            break;
                        case 2:
                            hardwareSp = hardwareSp + '(?,?),';
                            break;
                        case 3:
                            materialSp = materialSp + '(?,?,?,?,?,?,?),';
                            break;
                        case 4:
                            purshSp = purshSp + '(?,?),';
                            break;
                        case 5:
                            drawSp = drawSp + '(?,?),';
                            break;
                    }
                }
                sqlSpecifications = sqlMaterials.slice(0, sqlMaterials.length - 1);
                sqlSpecifications = `INSERT INTO osk.drawing_specification (idSpecification, ind,  idDrawing, type_position, quantity) VALUES ${sqlMaterials};`;
                if (rolledSp !== '') {
                    rolledSp = `INSERT INTO osk.sprolled (idSpecification, id_item, L, d_b, h, plasma) VALUES ${rolledSp};`;
                }
                if (hardwareSp !== '') {
                    hardwareSp = `INSERT INTO osk.sphardware (idSpecification, id_item) VALUES ${hardwareSp};`;
                }
                if (materialSp !== '') {
                    materialSp = `INSERT INTO osk.spmaterial (idSpecification, id_item, percent, value, specific_units, L, h) VALUES ${hardwareSp};`;
                }
                if (purshSp !== '') {
                    purshSp = `INSERT INTO osk.sppurshasered (idSpecification, id_item) VALUES ${hardwareSp};`;
                }
                if (drawSp !== '') {
                    drawSp = `INSERT INTO osk.spdrawing (idSpecification, idDrawing) VALUES ${hardwareSp};`;
                }
            }
            if (bodyData.drawing[0] !== null) {
                const dataParams = [];
                let sql = [];
                sql = [sqlBlank, sqlBlank, sqlMaterials, sqlSpecifications].map(item => {
                    if (item !== '') {
                        return item;
                    }
                });
                for (const key in bodyData) {
                    if (key) {
                        dataParams.push(key);
                    }
                }
                const data = this.appService.executeMultiple(dataParams, ...sql);
            }
            else {
                const result = await this.appService.execute(sqlDrawings, bodyData.drawing);
                const newDrawingId = (_a = result[0]) === null || _a === void 0 ? void 0 : _a.insertId;
                if (bodyData.materials) {
                    for (let i = 0; i < bodyData.materials.length / 8; i++) {
                        bodyData.materials[1 + 8 * i] = newDrawingId;
                    }
                    bodyData.blank[1] = newDrawingId;
                    bodyData.materials[1] = result[0].insertId;
                    await this.appService.executeMultiple([bodyData.blank, bodyData.materials], sqlBlank, sqlMaterials);
                }
                else {
                    bodyData.blank[1] = newDrawingId;
                    await this.appService.execute(sqlBlank, bodyData.blank);
                }
            }
            return { response: 'ok' };
        }
        catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                return { serverError: 'Чертеж с таким номером уже существует!' };
            }
            else {
                return { serverError: error.message };
            }
        }
    }
    async addMaterial(bodyData) {
        try {
            const sqlMaterial = `INSERT INTO drawing_materials (id, idDrawing, id_item, percent, value, specific_units, L, h) VALUES (?,?,?,?,?,?,?,?);`;
            const data = await this.appService.execute(sqlMaterial, bodyData);
            return { id: data[0].insertId };
        }
        catch (error) {
            return { serverError: error.message };
        }
    }
    async findByID(id) {
        try {
            return this.dravingSerice.findBy(`idDrawing=${id}`);
        }
        catch (error) {
            return { serverError: error.message };
        }
    }
    async findByNumber(drawingNumber) {
        try {
            return this.dravingSerice.findBy(`numberDrawing='${drawingNumber}'`);
        }
        catch (error) {
            return { serverError: error.message };
        }
    }
    scan() {
        try {
            const data = this.scanService.scanAllStaticResources(path.join(__dirname, '../..', 'drawings'));
            return { scan: data.map(path => path.slice(__dirname.length - 19)) };
        }
        catch (error) {
            return { serverError: error.message };
        }
    }
};
__decorate([
    (0, common_1.Post)('saveDrawing'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CreateDrawingsController.prototype, "saveDrawing", null);
__decorate([
    (0, common_1.Post)('saveBlank/:typeBlank'),
    __param(0, (0, common_1.Param)('typeBlank')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], CreateDrawingsController.prototype, "saveBlank", null);
__decorate([
    (0, common_1.Delete)('deleteBlank/:typeBlank/:id/:idDrawing/:newTypeBlank'),
    __param(0, (0, common_1.Param)('typeBlank')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Param)('idDrawing')),
    __param(3, (0, common_1.Param)('newTypeBlank')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number, Number]),
    __metadata("design:returntype", Promise)
], CreateDrawingsController.prototype, "deleteBlank", null);
__decorate([
    (0, common_1.Delete)('deleteMaterial/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CreateDrawingsController.prototype, "deleteMaterial", null);
__decorate([
    (0, common_1.Post)('addPositionSP'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CreateDrawingsController.prototype, "addPositionSP", null);
__decorate([
    (0, common_1.Post)('save/:typeBlank'),
    __param(0, (0, common_1.Param)('typeBlank')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CreateDrawingsController.prototype, "saveAll", null);
__decorate([
    (0, common_1.Post)('addMaterial'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CreateDrawingsController.prototype, "addMaterial", null);
__decorate([
    (0, common_1.Get)('findByID/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CreateDrawingsController.prototype, "findByID", null);
__decorate([
    (0, common_1.Get)('findByNumber/:number'),
    __param(0, (0, common_1.Param)('number')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CreateDrawingsController.prototype, "findByNumber", null);
__decorate([
    (0, common_1.Get)('scan'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CreateDrawingsController.prototype, "scan", null);
CreateDrawingsController = __decorate([
    (0, common_1.Controller)('drawings'),
    __metadata("design:paramtypes", [app_service_1.AppService, scan_service_1.ScanService, drawing_service_1.DrawingService])
], CreateDrawingsController);
exports.CreateDrawingsController = CreateDrawingsController;
//# sourceMappingURL=createDrawings.controller.js.map