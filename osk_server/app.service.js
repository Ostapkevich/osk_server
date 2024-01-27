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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
const pool_options_1 = require("./common/pool-options");
const promise_1 = require("mysql2/promise");
let AppService = class AppService {
    ;
    constructor() {
        this.connection = (0, promise_1.createPool)(pool_options_1.default);
    }
    async query(...queries) {
        const data = await Promise.all(queries.map(query => this.connection.query(query)));
        return data;
    }
    async execute(sql, params) {
        const data = await this.connection.execute(sql, params);
        return data;
    }
    async executeMultiple(bodyData, ...queries) {
        const data = await Promise.all(queries.map((query, index) => this.connection.execute(query, bodyData[index])));
        return data;
    }
};
AppService = __decorate([
    (0, common_2.Global)(),
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], AppService);
exports.AppService = AppService;
//# sourceMappingURL=app.service.js.map