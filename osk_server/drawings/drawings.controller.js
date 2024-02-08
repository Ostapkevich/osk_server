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
exports.DrawingsController = void 0;
const common_1 = require("@nestjs/common");
const app_service_1 = require("../app.service");
const scan_service_1 = require("./scan.service");
const path = require("path");
let DrawingsController = class DrawingsController {
    constructor(appService, scanService) {
        this.appService = appService;
        this.scanService = scanService;
    }
    async saveDrawing(bodyData) {
        try {
            const sqlDrawing = `INSERT INTO osk.drawings (idDrawing, numberDrawing, nameDrawing, weight, s, path) VALUES ( ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE idDrawing=VALUES(idDrawing), numberDrawing=VALUES(numberDrawing), nameDrawing=VALUES(nameDrawing), weight=VALUES(weight), path=VALUES(path) ;`;
            const data = await this.appService.execute(sqlDrawing, bodyData);
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
                sqlBlank = `INSERT INTO osk.drawing_blank_hardware (id, idDrawing, id_item) VALUES (?,?,?) ON DUPLICATE KEY UPDATE id=VALUES(id), id_item=VALUES(idDrawing) id_item=VALUES(id_item);`;
            }
            else if (+typeBlank === 3) {
                sqlBlank = `INSERT INTO osk.drawing_blank_material (id, idDrawing, id_item, percent, value, specific_units, L, h) VALUES (?,?, ?, ?, ?, ?,?,?) ON DUPLICATE KEY UPDATEid=VALUES(id),id_item=VALUES(idDrawing), id_item=VALUES(id_item), percent=VALUES(percent), value=VALUES(value), specific_units=VALUES(specific_units), L=VALUES(L), h=values(h);`;
            }
            else if (+typeBlank === 4) {
                sqlBlank = `INSERT INTO osk.drawing_blank_purshased (id, idDrawing  , id_item) VALUES (?,?, ?) ON DUPLICATE KEY UPDATE id=VALUES(id), id_item=VALUES(idDrawing) id_item=VALUES(id_item);`;
            }
            const data = await this.appService.execute(sqlBlank, bodyData);
            return { response: data[0].insertId };
        }
        catch (error) {
            console.log(error);
            return { serverError: error.message };
        }
    }
    async saveUnits(typeBlank, bodyData) {
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
                sqlBlank = `INSERT INTO osk.drawing_blank_material (id, idDrawing, id_item, percent, value, specific_units, L, h) VALUES (?,?, ?, ?, ?, ?,?,?) ON DUPLICATE KEY UPDATEid=VALUES(id),id_item=VALUES(idDrawing), id_item=VALUES(id_item), percent=VALUES(percent), value=VALUES(value), specific_units=VALUES(specific_units), L=VALUES(L), h=values(h);`;
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
            console.log(bodyData);
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
                console.log(result);
                const newDrawingId = (_a = result[0]) === null || _a === void 0 ? void 0 : _a.insertId;
                if (bodyData.materials) {
                    for (let i = 0; i < bodyData.materials.length / 8; i++) {
                        bodyData.materials[1 + 8 * i] = newDrawingId;
                    }
                    bodyData.blank[1] = newDrawingId;
                    bodyData.materials[1] = result[0].insertId;
                    console.log('изм ', bodyData.materials);
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
            console.log(error);
            if (error.code === 'ER_DUP_ENTRY') {
                return { serverError: 'Чертеж с таким номером уже существует!' };
            }
            else {
                return { serverError: error.message };
            }
        }
    }
    async findByID(id) {
        try {
            return this.findBy(`idDrawing=${id}`);
        }
        catch (error) {
            return { serverError: error.message };
        }
    }
    async findByNumber(drawingNumber) {
        try {
            return this.findBy(`numberDrawing='${drawingNumber}'`);
        }
        catch (error) {
            return { serverError: error.message };
        }
    }
    async findBy(partOfSql) {
        try {
            const sqlDrawing = `SELECT idDrawing, numberDrawing, nameDrawing, weight, type_blank, s, path FROM osk.drawings WHERE ${partOfSql};`;
            const dataDrawing = await this.appService.query(sqlDrawing);
            let dataBlank = undefined;
            let dataMaterial = undefined;
            let dataSP = undefined;
            if (dataDrawing[0][0][0].type_blank) {
                const typeBlank = dataDrawing[0][0][0].type_blank;
                let sqlBlank = '';
                switch (typeBlank) {
                    case 1:
                        sqlBlank = `SELECT id, drawing_blank_rolled.id_item, plasma, L, d_b, h, allowance, rolled.name_item, rolled.weight, rolled.d, rolled.t, rolled_type.uselength  FROM drawing_blank_rolled
                        INNER JOIN rolled ON rolled.id_item=drawing_blank_rolled.id_item
                        INNER JOIN rolled_type ON rolled.id_type=rolled_type.id_type
                       WHERE idDrawing=${dataDrawing[0][0][0].idDrawing};`;
                        break;
                }
                const sqlBla = ` CASE
                    WHEN type_blank = 1 THEN
                        (SELECT CONCAT(drawing_blank_rolled.id, ',', drawing_blank_rolled.id_item, ',', drawing_blank_rolled.plasma, ',', drawing_blank_rolled.L, ',', drawing_blank_rolled.d_b, ',', drawing_blank_rolled.h, ',', rolled.name_item, ',', rolled.weight, ',', rolled_type.uselength)
                        FROM drawing_blank_rolled INNER JOIN rolled ON drawing_blank_rolled.id_item = rolled.id_item 
                        INNER JOIN rolled_type ON rolled.id_type = rolled_type.id_type WHERE drawing_blank_rolled.idDrawing = 1 )
                    WHEN type_blank = 2 THEN
                        (SELECT CONCAT(drawing_blank_hardware.id, ',', drawing_blank_hardware.id_item)
                        FROM drawing_blank_hardware)
                    WHEN type_blank = 3 THEN
                        (SELECT CONCAT(drawing_blank_material.id, ',', drawing_blank_material.id_item, ',', drawing_blank_material.percent, ',', drawing_blank_material.value, ',', drawing_blank_material.specific_units, ',', drawing_blank_material.L, ',', drawing_blank_material.h)
                        FROM drawing_blank_material)
                    ELSE
                        (SELECT CONCAT(drawing_blank_purshased.id, ',', drawing_blank_purshased.id_item)
                        FROM drawing_blank_purshased)
                END AS result
            FROM osk.drawings
            WHERE idDrawing = 1;`;
                dataBlank = await this.appService.query(sqlBlank);
            }
            return { drawing: dataDrawing[0][0][0], blank: dataBlank[0][0][0] };
        }
        catch (error) {
            console.log(error);
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
], DrawingsController.prototype, "saveDrawing", null);
__decorate([
    (0, common_1.Post)('saveBlank/:typeBlank'),
    __param(0, (0, common_1.Param)('typeBlank')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], DrawingsController.prototype, "saveBlank", null);
__decorate([
    (0, common_1.Post)('save/:typeBlank'),
    __param(0, (0, common_1.Param)('typeBlank')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], DrawingsController.prototype, "saveUnits", null);
__decorate([
    (0, common_1.Get)('findByID/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], DrawingsController.prototype, "findByID", null);
__decorate([
    (0, common_1.Get)('findByNumber/:number'),
    __param(0, (0, common_1.Param)('number')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DrawingsController.prototype, "findByNumber", null);
__decorate([
    (0, common_1.Get)('scan'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DrawingsController.prototype, "scan", null);
DrawingsController = __decorate([
    (0, common_1.Controller)('drawings'),
    __metadata("design:paramtypes", [app_service_1.AppService, scan_service_1.ScanService])
], DrawingsController);
exports.DrawingsController = DrawingsController;
//# sourceMappingURL=drawings.controller.js.map