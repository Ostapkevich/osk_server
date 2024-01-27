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
    async saveUnits(typeBlank, bodyData) {
        var _a;
        try {
            let sqlBlank = '';
            let sqlMaterials = '';
            let sqlDrawings = '';
            if (+typeBlank !== 0) {
                sqlDrawings = `INSERT INTO osk.drawings (idDrawing, numberDrawing, isp, nameDrawing, weight, type_blank, has_material, L, d_b, h, s, path, isDetail) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;
                if (+typeBlank === 1) {
                    sqlBlank = `INSERT INTO osk.drawing_blank_rolled (id, idDrawing, id_item, value) VALUES (?,?, ?, ?) ON DUPLICATE KEY UPDATE id=VALUES(id), idDrawing=VALUES(idDrawing), id_item=VALUES(id_item), value=VALUES(value);`;
                }
                else if (+typeBlank === 2) {
                    sqlBlank = `INSERT INTO osk.drawing_blank_hardware (id, idDrawing, id_item, value) VALUES (?,?, ?, ?) ON DUPLICATE KEY UPDATE id=VALUES(id), idDrawing=VALUES(idDrawing) id_item=VALUES(id_item);`;
                }
                else if (+typeBlank === 3) {
                    sqlBlank = `INSERT INTO osk.drawing_blank_material (id, idDrawing, id_item, percent, value, specific_units) VALUES (?,?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATEid=VALUES(id),idDrawing=VALUES(idDrawing), id_item=VALUES(id_item), percent=VALUES(percent), value=VALUES(value), specific_units=VALUES(specific_units);`;
                }
                else {
                    sqlBlank = `INSERT INTO osk.drawing_blank_purshased (id, idDrawing, id_item) VALUES (?,?, ?, ?) ON DUPLICATE KEY UPDATE id=VALUES(id), idDrawing=VALUES(idDrawing) id_item=VALUES(id_item);`;
                }
                if (bodyData.materials) {
                    for (let index = 0; index < bodyData.materials.length / 6; index++) {
                        sqlMaterials = sqlMaterials + '(?,?, ?, ?, ?, ?),';
                    }
                    sqlMaterials = sqlMaterials.slice(0, sqlMaterials.length - 1);
                    sqlMaterials = `INSERT INTO osk.drawing_materials (id, idDrawing, id_item, percent, value, specific_units) VALUES ${sqlMaterials} ON DUPLICATE KEY UPDATE id=VALUES(id), idDrawing=VALUES(idDrawing), id_item=VALUES(id_item), percent=VALUES(percent), value=VALUES(value), specific_units=VALUES(specific_units);`;
                }
                if (bodyData.drawing[0] !== null) {
                    if (bodyData.materials) {
                        const data = this.appService.executeMultiple([bodyData.drawing, bodyData.blank, bodyData.materials], sqlDrawings, sqlBlank, sqlMaterials);
                    }
                    else {
                        const data = this.appService.executeMultiple([bodyData.drawing, bodyData.blank], sqlDrawings, sqlBlank);
                    }
                }
                else {
                    const result = await this.appService.execute(sqlDrawings, bodyData.drawing);
                    console.log(result);
                    const newDrawingId = (_a = result[0]) === null || _a === void 0 ? void 0 : _a.insertId;
                    if (bodyData.materials) {
                        for (let i = 0; i < bodyData.materials.length / 6; i++) {
                            bodyData.materials[1 + 6 * i] = newDrawingId;
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
            }
            else {
            }
            return { response: 'ok' };
        }
        catch (error) {
            console.log(error);
            if (error.code = 'ER_DUP_ENTRY') {
                return { serverError: 'Чертеж с таким номером уже существует!' };
            }
            else {
                return { serverError: error.message };
            }
        }
    }
    scan() {
        try {
            console.log('dirNm ', __dirname);
            const data = this.scanService.scanAllStaticResources(path.join(__dirname, '../..', 'drawings'));
            console.log(data);
            return { scan: data.map(path => path.slice(__dirname.length - 19)) };
        }
        catch (error) {
            return { serverError: error.message };
        }
    }
};
__decorate([
    (0, common_1.Post)('saveDrawing/:typeBlank'),
    __param(0, (0, common_1.Param)('typeBlank')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], DrawingsController.prototype, "saveUnits", null);
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