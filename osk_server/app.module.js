"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const serve_static_1 = require("@nestjs/serve-static");
const app_controller_1 = require("./app.controller");
const path_1 = require("path");
const new_order_module_1 = require("./new-order/new-order.module");
const new_units_module_1 = require("./new-units/new-units.module");
const materials_module_1 = require("./materials/materials.module");
const drawings_module_1 = require("./new-drawing/drawings.module");
const views_module_1 = require("./view/views.module");
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            serve_static_1.ServeStaticModule.forRoot({
                rootPath: (0, path_1.join)(__dirname, 'pdf'),
            }),
            views_module_1.ViewsModule,
            drawings_module_1.DrawingsModule,
            new_order_module_1.NewOrderModule,
            new_units_module_1.NewUnitsModule,
            materials_module_1.MaterialsModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [],
        exports: [],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map