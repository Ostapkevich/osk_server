import { Controller, Put, Body, Param, Post, Get } from '@nestjs/common';
import { AppService } from 'src/app.service';
import { ScanService } from 'src/scan/scan.service';
import * as path from 'path';

@Controller('drawings')
export class DrawingsController {
    constructor(protected appService: AppService, private scanService: ScanService) { }

    @Post('saveDrawing/:typeBlank')
    async saveUnits(@Param('typeBlank') typeBlank: string,
        @Body() bodyData) {
        try {
            let sqlBlank = '';
            let sqlMaterials = '';
            let sqlDrawings = ''
            if (+typeBlank !== 0) {
                sqlDrawings = `INSERT INTO osk.drawings (idDrawing, numberDrawing, isp, nameDrawing, weight, type_blank, has_material, L, d_b, h, s, path) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE idDrawing=VALUES(idDrawing), numberDrawing=VALUES(numberDrawing), isp=VALUES(isp), nameDrawing=VALUES(nameDrawing), weight=VALUES(weight), type_blank=VALUES(type_blank), has_material=VALUES(has_material), L=VALUES(L), d_b=VALUES(d_b), h=VALUES(h), s=VALUES(s), path=VALUES(path);`;
                if (+typeBlank === 1) {
                    sqlBlank = `INSERT INTO osk.drawing_blank_rolled (id, idDrawing, id_item, value) VALUES (?,?, ?, ?) ON DUPLICATE KEY UPDATE id=VALUES(id), idDrawing=VALUES(idDrawing), id_item=VALUES(id_item), value=VALUES(value);`;
                } else if (+typeBlank === 2) {
                    sqlBlank = `INSERT INTO osk.drawing_blank_hardware (id, idDrawing, id_item, value) VALUES (?,?, ?, ?) ON DUPLICATE KEY UPDATE id=VALUES(id), idDrawing=VALUES(idDrawing) id_item=VALUES(id_item);`;
                } else if (+typeBlank === 3) {
                    sqlBlank = `INSERT INTO osk.drawing_blank_material (id, idDrawing, id_item, percent, value, specific_units) VALUES (?,?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATEid=VALUES(id),idDrawing=VALUES(idDrawing), id_item=VALUES(id_item), percent=VALUES(percent), value=VALUES(value), specific_units=VALUES(specific_units);`;
                } else {
                    sqlBlank = `INSERT INTO osk.drawing_blank_purshased (id, idDrawing, id_item) VALUES (?,?, ?, ?) ON DUPLICATE KEY UPDATE id=VALUES(id), idDrawing=VALUES(idDrawing) id_item=VALUES(id_item);`;
                }
                if (bodyData.materials) {
                    for (let index = 0; index < bodyData.materials.length / 6; index++) {
                        sqlMaterials = sqlMaterials + '(?,?, ?, ?, ?, ?),'
                    }
                    sqlMaterials = sqlMaterials.slice(0, sqlMaterials.length - 1);
                    sqlMaterials = `INSERT INTO osk.drawing_materials (id, idDrawing, id_item, percent, value, specific_units) VALUES ${sqlMaterials} ON DUPLICATE KEY UPDATE id=VALUES(id), idDrawing=VALUES(idDrawing), id_item=VALUES(id_item), percent=VALUES(percent), value=VALUES(value), specific_units=VALUES(specific_units);`;
                }
                if (bodyData.drawing[0] !== null) {
                    if (bodyData.materials) {
                        const data = this.appService.executeMultiple([bodyData.drawing, bodyData.blank, bodyData.materials], sqlDrawings, sqlBlank, sqlMaterials)
                    } else {
                        const data = this.appService.executeMultiple([bodyData.drawing, bodyData.blank], sqlDrawings, sqlBlank)
                    }
                } else {
                    const result: any = await this.appService.execute(sqlDrawings, bodyData.drawing);
                    const newDrawingId = result[0]?.insertId;
                    if (bodyData.materials) {
                        for (let i = 0; i < bodyData.materials.length / 6; i++) {
                            bodyData.materials[1 + 6 * i] = newDrawingId;
                        }
                        bodyData.blank[1] = newDrawingId;
                        bodyData.materials[1] = result[0].insertId;
                        await this.appService.executeMultiple([bodyData.blank, bodyData.materials], sqlBlank, sqlMaterials);
                    } else {
                        bodyData.blank[1] = newDrawingId;
                        await this.appService.execute(sqlBlank, bodyData.blank);
                    }
                }
            } else {
            }
            return { response: 'ok' }
        } catch (error) {
            console.log(error)
            return { serverError: error.message };
        }
    }

    @Get('scan')
    async scan() {
        try {
            const data = await this.scanService.scanAllStaticResources(path.join(__dirname, '../..', 'drawings'))
            return { scan: data }
        } catch (error) {

            return { serverError: error.message };
        }
    }
}
