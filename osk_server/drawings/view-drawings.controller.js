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
exports.ViewDrawingsController = void 0;
const common_1 = require("@nestjs/common");
const app_service_1 = require("../app.service");
let ViewDrawingsController = class ViewDrawingsController {
    constructor(appService) {
        this.appService = appService;
    }
    async viewDrawings(searchParams) {
        try {
            const params = [];
            let sqlDrawings = `SELECT idDrawing, type_blank FROM drawings WHERE 1=1 `;
            if (searchParams.idDrawing) {
                sqlDrawings += " AND " + 'idDrawing=? ORDER BY drawings.idDrawing';
                params.push(searchParams.idDrawing);
            }
            if (searchParams.numberDrawing) {
                sqlDrawings += " AND " + `LOWER (numberDrawing) LIKE LOWER (?) ORDER BY drawings.idDrawing`;
                params.push(searchParams.numberDrawing);
            }
            if (searchParams.nameDrawing) {
                sqlDrawings += " AND " + 'LOWER (nameDrawing) LIKE LOWER (?) ORDER BY drawings.idDrawing';
                params.push(searchParams.nameDrawing);
            }
            if (searchParams.min) {
                sqlDrawings += " AND " + 'weight>=? ORDER BY drawings.idDrawing';
                params.push(searchParams.min);
            }
            if (searchParams.max) {
                sqlDrawings += " AND " + 'weight<=? ORDER BY drawings.idDrawing';
                params.push(searchParams.max);
            }
            let data = await this.appService.execute(sqlDrawings, params);
            console.log(data[0]);
            if (data[0].length > 0) {
                const sqlArray = [];
                let sqlDrawing = '';
                let sqlSb = '';
                const drawings = [];
                let dataDtawings;
                let dataSb;
                for (const item of data[0]) {
                    switch (item.type_blank) {
                        case 1:
                            sqlDrawing = `SELECT drawings.idDrawing , drawings.numberDrawing, drawings.nameDrawing, drawings.weight, drawings.path, drawings.weight, drawing_blank_rolled.plasma, (drawing_blank_rolled.L +drawing_blank_rolled.allowance) AS len, (drawing_blank_rolled.d_b+drawing_blank_rolled.allowance) AS dw, (drawing_blank_rolled.h+drawing_blank_rolled.allowance) AS h, rolled.name_item, rolled_type.uselength, 
            CASE
                WHEN rolled_type.uselength=1 THEN (drawing_blank_rolled.L + drawing_blank_rolled.allowance)*rolled.weight/1000  
                ELSE 
                    CASE 
                    WHEN drawing_blank_rolled.h IS NULL THEN ((drawing_blank_rolled.d_b + drawing_blank_rolled.allowance)*(drawing_blank_rolled.d_b + drawing_blank_rolled.allowance))*rolled.weight/1000000
                    ELSE ((drawing_blank_rolled.d_b + drawing_blank_rolled.allowance)*(drawing_blank_rolled.h + drawing_blank_rolled.allowance))*rolled.weight/1000000
                    END
            END AS value 
            FROM drawings
            LEFT JOIN drawing_blank_rolled ON drawings.idDrawing=drawing_blank_rolled.idDrawing
            INNER JOIN rolled ON rolled.id_item=drawing_blank_rolled.id_item
            INNER JOIN rolled_type ON rolled.id_type=rolled_type.id_type
           WHERE drawings.idDrawing=${item.idDrawing};`;
                            break;
                        case 2:
                            sqlDrawing = `SELECT drawings.idDrawing, drawings.numberDrawing, drawings.nameDrawing, drawings.weight, drawings.path, drawings.weight, hardware.name_item, hardware.weight
                FROM drawings
                INNER JOIN drawing_blank_hardware ON drawings.idDrawing=drawing_blank_hardware.idDrawing
                INNER JOIN hardware ON hardware.id_item=drawing_blank_hardware.id_item
                INNER JOIN hardware_type ON hardware.id_type=hardware_type.id_type
               WHERE drawings.idDrawing=${item.idDrawing};`;
                            break;
                        case 3:
                            sqlDrawing = `SELECT drawings.idDrawing, drawings.numberDrawing, drawings.nameDrawing, drawings.weight, drawings.path, drawings.weight, drawing_blank_material.percent, drawing_blank_material.value, drawing_blank_material.specific_units, drawing_blank_material.L AS len, drawing_blank_material.h, material.name_item, material.units 
                FROM drawings
                INNER JOIN drawing_blank_material ON drawings.idDrawing=drawing_blank_material.idDrawing
                INNER JOIN material ON material.id_item=drawing_blank_material.id_item
                INNER JOIN material_type ON material.id_type=material_type.id_type
                WHERE drawings.idDrawing=${item.idDrawing};`;
                            break;
                        case 4:
                            sqlDrawing = `SELECT drawings.idDrawing, drawings.numberDrawing, drawings.nameDrawing, drawings.weight, drawings.path, drawings.weight, purchased.name_item, purchased.weight 
                FROM drawings
                INNER JOIN drawing_blank_purshased ON drawings.idDrawing=drawing_blank_purshased.idDrawing
                INNER JOIN purchased ON purchased.id_item=drawing_blank_purshased.id_item
                INNER JOIN purchased_type ON purchased.id_type=purchased_type.id_type
                WHERE drawings.idDrawing=${item.idDrawing};`;
                            break;
                        default:
                            sqlDrawing = `SELECT drawings.idDrawing, drawings.numberDrawing, drawings.nameDrawing, drawings.weight, drawings.path, drawings.weight, 'noBlank' AS noBlank  FROM drawings WHERE drawings.idDrawing=${item.idDrawing};`;
                            break;
                    }
                    sqlSb = `SELECT CASE WHEN EXISTS (SELECT * FROM drawing_specification WHERE idDrawing=${item.idDrawing}) THEN 1 ELSE 0 END AS isSB;`;
                    dataDtawings = await this.appService.query(sqlDrawing);
                    dataSb = await this.appService.query(sqlSb);
                    dataDtawings[0][0][0].isSB = dataSb[0][0][0].isSB;
                    drawings.push(dataDtawings[0][0][0]);
                }
                console.log('drawings  ', drawings);
                return { drawings: drawings };
            }
            else {
                return { notFound: 'not found' };
            }
        }
        catch (error) {
            console.log(error);
            return { serverError: error.message };
        }
    }
};
__decorate([
    (0, common_1.Get)('selectDrawings'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ViewDrawingsController.prototype, "viewDrawings", null);
ViewDrawingsController = __decorate([
    (0, common_1.Controller)('viewDrawing'),
    __metadata("design:paramtypes", [app_service_1.AppService])
], ViewDrawingsController);
exports.ViewDrawingsController = ViewDrawingsController;
//# sourceMappingURL=view-drawings.controller.js.map