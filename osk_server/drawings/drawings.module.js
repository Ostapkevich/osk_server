"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DrawingsModule = void 0;
const common_1 = require("@nestjs/common");
const scan_service_1 = require("./scan.service");
const createDrawings_controller_1 = require("./createDrawings.controller");
const app_service_1 = require("../app.service");
const view_drawings_controller_1 = require("./view-drawings.controller");
const drawing_service_1 = require("./drawing.service");
let DrawingsModule = class DrawingsModule {
};
DrawingsModule = __decorate([
    (0, common_1.Module)({
        providers: [app_service_1.AppService, scan_service_1.ScanService, drawing_service_1.DrawingService],
        controllers: [createDrawings_controller_1.CreateDrawingsController, view_drawings_controller_1.ViewDrawingsController]
    })
], DrawingsModule);
exports.DrawingsModule = DrawingsModule;
//# sourceMappingURL=drawings.module.js.map