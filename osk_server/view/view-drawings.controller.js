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
            let sqlDrawings = `SELECT idDrawing AS id_item, numberDrawing AS number_item, nameDrawing AS name_item, weight, path FROM drawings WHERE 1=1`;
            if (searchParams.idDrawing) {
                sqlDrawings += " AND " + 'idDrawing=?';
                params.push(searchParams.idDrawing);
            }
            if (searchParams.numberDrawing) {
                sqlDrawings += " AND " + `LOWER (numberDrawing) LIKE LOWER (?)`;
                params.push(searchParams.numberDrawing);
            }
            if (searchParams.nameDrawing) {
                sqlDrawings += " AND " + 'LOWER (nameDrawing) LIKE LOWER (?)';
                params.push(searchParams.nameDrawing);
            }
            if (searchParams.min) {
                sqlDrawings += " AND " + 'weight>=?';
                params.push(searchParams.min);
            }
            if (searchParams.max) {
                sqlDrawings += " AND " + 'weight<=?';
                params.push(searchParams.max);
            }
            const data = await this.appService.execute(sqlDrawings, params);
            console.log(data[0]);
            return { drawings: data[0] };
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