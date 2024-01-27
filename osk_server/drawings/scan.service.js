"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScanService = void 0;
const common_1 = require("@nestjs/common");
const fs = require("fs");
const path = require("path");
let ScanService = class ScanService {
    scanAllStaticResources(resourcePath) {
        const finalFolders = [];
        const scanFolder = (folderPath) => {
            const files = fs.readdirSync(folderPath);
            let isFinalFolder = true;
            files.forEach((file) => {
                const filePath = path.join(folderPath, file);
                if (fs.statSync(filePath).isDirectory()) {
                    isFinalFolder = false;
                    scanFolder(filePath);
                }
            });
            if (isFinalFolder) {
                finalFolders.push(folderPath);
            }
        };
        scanFolder(resourcePath);
        return finalFolders;
    }
};
ScanService = __decorate([
    (0, common_1.Injectable)()
], ScanService);
exports.ScanService = ScanService;
//# sourceMappingURL=scan.service.js.map