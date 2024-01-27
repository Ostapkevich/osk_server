"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewUnitsModule = void 0;
const common_1 = require("@nestjs/common");
const new_units_controller_1 = require("./new-units.controller");
const app_service_1 = require("../app.service");
let NewUnitsModule = class NewUnitsModule {
};
NewUnitsModule = __decorate([
    (0, common_1.Module)({
        controllers: [new_units_controller_1.NewUnitsController],
        providers: [app_service_1.AppService]
    })
], NewUnitsModule);
exports.NewUnitsModule = NewUnitsModule;
//# sourceMappingURL=new-units.module.js.map