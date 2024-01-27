"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaterialsModule = void 0;
const common_1 = require("@nestjs/common");
const rolled_controller_1 = require("./rolled.controller");
const hardware_controller_1 = require("./hardware.controller");
const materials_controller_1 = require("./materials.controller");
const app_service_1 = require("../app.service");
const purchased_controller_1 = require("./purchased.controller");
const type_materials_controller_1 = require("./type-materials.controller");
let MaterialsModule = class MaterialsModule {
};
MaterialsModule = __decorate([
    (0, common_1.Module)({
        controllers: [rolled_controller_1.RolledController, hardware_controller_1.HardwareController, materials_controller_1.MaterailsController, purchased_controller_1.PurchasedController, type_materials_controller_1.TypeMaterialsController],
        providers: [app_service_1.AppService]
    })
], MaterialsModule);
exports.MaterialsModule = MaterialsModule;
//# sourceMappingURL=materials.module.js.map