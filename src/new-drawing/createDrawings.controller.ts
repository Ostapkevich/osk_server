import { Controller, Put, Body, Param, Post, Get, Delete } from '@nestjs/common';
import { AppService } from 'src/app.service';
import { ScanService } from 'src/new-drawing/scan.service';
import * as path from 'path';
import { DrawingService } from './drawing.service';

@Controller('drawings')
export class CreateDrawingsController {
    constructor(protected appService: AppService, private scanService: ScanService, private dravingSerice: DrawingService) { }

    @Post('saveDrawing')
    async saveDrawing(@Body() bodyData) {
        try {
            // sqlDrawings = `INSERT INTO osk.drawings (idDrawing, numberDrawing, isp, nameDrawing, weight, type_blank, has_material, L, d_b, h, s, path, isDetail) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE idDrawing=VALUES(idDrawing), numberDrawing=VALUES(numberDrawing), isp=VALUES(isp), nameDrawing=VALUES(nameDrawing), weight=VALUES(weight), type_blank=VALUES(type_blank), has_material=VALUES(has_material), L=VALUES(L), d_b=VALUES(d_b), h=VALUES(h), s=VALUES(s), path=VALUES(path), isDetail=VALUES(isDetail);`;
            const sqlDrawing = `INSERT INTO osk.drawings (idDrawing, numberDrawing, nameDrawing, weight, s, path) VALUES ( ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE idDrawing=VALUES(idDrawing), numberDrawing=VALUES(numberDrawing), nameDrawing=VALUES(nameDrawing), weight=VALUES(weight), s=VALUES(s), path=VALUES(path) ;`;
            const data: any = await this.appService.execute(sqlDrawing, bodyData);
            return { response: data[0].insertId };
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                return { serverError: 'Чертеж с таким номером уже существует!' };
            } else {
                return { serverError: error.message };
            }
        }
    }

    @Post('saveBlank/:typeBlank')
    async saveBlank(@Param('typeBlank') typeBlank: number, @Body() bodyData) {
        try {
            await this.appService.execute(`UPDATE drawings SET type_blank=${typeBlank} WHERE idDrawing=${bodyData[1]}`, bodyData);
            let sqlBlank = '';
            if (+typeBlank === 1) {
                sqlBlank = `INSERT INTO osk.drawing_blank_rolled (id, idDrawing, id_item, L, d_b, h, plasma, allowance) VALUES (?,?, ?, ?, ?,?,?,?) ON DUPLICATE KEY UPDATE id=VALUES(id), idDrawing=VALUES(idDrawing), id_item=VALUES(id_item), L=VALUES(L), d_b=VALUES(d_b), h=values(h), plasma=VALUES(plasma), allowance=VALUES(allowance);`;
            } else if (+typeBlank === 2) {
                sqlBlank = `INSERT INTO osk.drawing_blank_hardware (id, idDrawing, id_item) VALUES (?,?,?) ON DUPLICATE KEY UPDATE id=VALUES(id), idDrawing=VALUES(idDrawing), id_item=VALUES(id_item);`;
            } else if (+typeBlank === 3) {
                sqlBlank = `INSERT INTO osk.drawing_blank_material (id, idDrawing, id_item, percent, value, specific_units, L, h) VALUES (?,?, ?, ?, ?, ?,?,?) ON DUPLICATE KEY UPDATE id=VALUES(id), idDrawing=VALUES(idDrawing), id_item=VALUES(id_item),  percent=VALUES(percent), value=VALUES(value), specific_units=VALUES(specific_units), L=VALUES(L), h=values(h);`;
            } else if (+typeBlank === 4) {
                sqlBlank = `INSERT INTO osk.drawing_blank_purshased (id, idDrawing, id_item) VALUES (?,?,?) ON DUPLICATE KEY UPDATE id=VALUES(id), idDrawing=VALUES(idDrawing), id_item=VALUES(id_item);`;
            }
            const data: any = await this.appService.execute(sqlBlank, bodyData);
            return { id: data[0].insertId };
        } catch (error) {
            return { serverError: error.message };
        }
    }


    @Delete('deleteBlank/:typeBlank/:id/:idDrawing/:newTypeBlank')
    async deleteBlank(@Param('typeBlank') typeBlank: number, @Param('id') id: number, @Param('idDrawing') idDrawing: number, @Param('newTypeBlank') newTypeBlank: number | null) {
        try {
            let oldTable = '';
            switch (+typeBlank) {
                case 1:
                    oldTable = 'drawing_blank_rolled'
                    break;
                case 2:
                    oldTable = 'drawing_blank_hardware'
                    break;
                case 3:
                    oldTable = 'drawing_blank_material'
                    break;
                case 4:
                    oldTable = 'drawing_blank_purshased'
                    break;
            }
            const data: any = await this.appService.query(`DELETE FROM ${oldTable} WHERE id=${id}`, `UPDATE drawings SET type_blank = ${newTypeBlank} WHERE idDrawing=${idDrawing} `);
            if (data[0][0].affectedRows && data[1][0].affectedRows) {
                return { response: 'ok' };
            }
        } catch (error) {
            return { serverError: error.message };
        }
    }

    @Delete('deleteMaterial/:id')
    async deleteMaterial(@Param('id') id: number) {
        try {
            const data: any = await this.appService.query(`DELETE FROM drawing_materials WHERE id=${id}`);
            if (data[0][0].affectedRows && data[0][0].affectedRows) {
                return { response: 'ok' };
            }
        } catch (error) {
            return { serverError: error.message };
        }
    }

    @Post('addPositionSP')
    async addPositionSP(@Body() bodyData: any) {
        try {
            if (bodyData.dataSP[0] !== null) {
                await this.appService.query(`UPDATE drawing_specification SET ind = ind + 1 WHERE idDrawing = ${bodyData.dataSP[2]} AND ind >= ${bodyData.dataSP[1]};`);
                return { response: 'ok' };
            }
            let data: any = await this.appService.execute(`INSERT INTO drawing_specification (id, ind, idDrawing, type_position, quantity) VALUES (?,?,?,?,?) ON DUPLICATE KEY UPDATE id=VALUES(id),ind=VALUES(ind),idDrawing=VALUES(idDrawing), type_position=VALUES(type_position), quantity=VALUES(quantity)`, bodyData.dataSP);
            let idParent: number | null;
            idParent = data[0].insertId;
            (bodyData.dataDetails as Array<any>).pop();
            (bodyData.dataDetails as Array<any>).push(idParent);
            let sqlPosition = '';
            const typePosition = bodyData.dataSP[3];
            if (typePosition === 1) {//б/ч Прокат
                sqlPosition = `INSERT INTO osk.sprolled (id_sprolled, id_item, L, d_b, h, plasma, name, id) VALUES (?,?,?,?,?,?,?,?) ON DUPLICATE KEY UPDATE id_sprolled=VALUES(id_sprolled), id_item=VALUES(id_item), L=VALUES(L), d_b=VALUES(d_b), h=values(h), plasma=VALUES(plasma), name=VALUES(name), id=VALUES(id);`;
            } else if (typePosition === 2) {//б/ч Метизы
                sqlPosition = `INSERT INTO osk.sphardware (id_sphardware, id_item, name, id) VALUES (?,?,?,?) ON DUPLICATE KEY UPDATE id_sphardware=VALUES(id_sphardware), id_item=VALUES(id_item), name=VALUES(name), id=VALUES(id);`;
            } else if (typePosition === 3) {//б/ч Материалы
                sqlPosition = `INSERT INTO osk.spmaterial (id_spmaterial, id_item, percent, value, specific_units, L, h, name, id) VALUES (?,?,?,?,?,?,?,?,?) ON DUPLICATE KEY UPDATE id_spmaterial=VALUES(id_spmaterial), id_item=VALUES(id_item),  percent=VALUES(percent), value=VALUES(value), specific_units=VALUES(specific_units), L=VALUES(L), h=values(h), name=values(name), id=VALUES(id);`;
            } else if (typePosition === 4) {//б/ч Покупные
                sqlPosition = `INSERT INTO osk.sppurshasered (id_sppurshasered, id_item, name, id) VALUES (?,?,?,?) ON DUPLICATE KEY UPDATE id_sppurshasered=VALUES(id_sppurshasered), id_item=VALUES(id_item), name=VALUES(name), id=VALUES(id);`;
            } else {//Чертеж
                sqlPosition = `INSERT INTO osk.spdrawing (id_spdrawing, idDrawing, id) VALUES (?,?,?) ON DUPLICATE KEY UPDATE id_spdrawing=VALUES(id_spdrawing), idDrawing=VALUES(idDrawing),id=VALUES(id);`;
            }
            data = await this.appService.execute(sqlPosition, bodyData.dataDetails);
            if (data[0].insertId) {
                return { idParent: idParent, idChild: data[0].insertId };
            } else {
                return { response: 'Что то пошло не так.' };
            }

        } catch (error) {
            return { serverError: error.message };
        }
    }


    @Post('save/:typeBlank')
    async saveAll(@Param('typeBlank') typeBlank: string,
        @Body() bodyData) {
        try {
            let sqlBlank = '';
            let sqlMaterials = '';
            let sqlDrawings = '';
            let sqlSpecifications = '';
            let rolledSp = '';
            let hardwareSp = '';
            let materialSp = '';
            let purshSp = '';
            let drawSp = '';
            // sqlDrawings = `INSERT INTO osk.drawings (idDrawing, numberDrawing, isp, nameDrawing, weight, type_blank, has_material, L, d_b, h, s, path, isDetail) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE idDrawing=VALUES(idDrawing), numberDrawing=VALUES(numberDrawing), isp=VALUES(isp), nameDrawing=VALUES(nameDrawing), weight=VALUES(weight), type_blank=VALUES(type_blank), has_material=VALUES(has_material), L=VALUES(L), d_b=VALUES(d_b), h=VALUES(h), s=VALUES(s), path=VALUES(path), isDetail=VALUES(isDetail);`;
            sqlDrawings = `INSERT INTO osk.drawings (idDrawing, numberDrawing, nameDrawing, weight, type_blank, s, path) VALUES ( ?, ?, ?, ?, ?, ?, ?);`;
            if (+typeBlank === 1) {
                sqlBlank = `INSERT INTO osk.drawing_blank_rolled (id, idDrawing, id_item, value, plasma,L, d_b, h, persent) VALUES (?,?, ?, ?, ?,?,?,?,?) ON DUPLICATE KEY UPDATE id=VALUES(id), idDrawing=VALUES(idDrawing), id_item=VALUES(id_item), value=VALUES(value), plasma=VALUES(plasma), L=VALUES(L), d_b=VALUES(d_b), h=values(h), percent=values(percent);`;
            } else if (+typeBlank === 2) {
                sqlBlank = `INSERT INTO osk.drawing_blank_hardware (id, idDrawing, id_item, value) VALUES (?,?, ?, ?) ON DUPLICATE KEY UPDATE id=VALUES(id), id_item=VALUES(idDrawing) id_item=VALUES(id_item);`;
            } else if (+typeBlank === 3) {
                sqlBlank = `INSERT INTO osk.drawing_blank_material (id, idDrawing, id_item, percent, value, specific_units, L, h) VALUES (?,?, ?, ?, ?, ?,?,?) ON DUPLICATE KEY UPDATE id=VALUES(id),id_item=VALUES(idDrawing), id_item=VALUES(id_item), percent=VALUES(percent), value=VALUES(value), specific_units=VALUES(specific_units), L=VALUES(L), h=values(h);`;
            } else if (+typeBlank === 4) {
                sqlBlank = `INSERT INTO osk.drawing_blank_purshased (id, idDrawing  , id_item) VALUES (?,?, ?, ?) ON DUPLICATE KEY UPDATE id=VALUES(id), id_item=VALUES(idDrawing) id_item=VALUES(id_item);`;
            }
            /* sql материалов */
            if (bodyData.materials) {
                for (let index = 0; index < bodyData.materials.length / 8; index++) {
                    sqlMaterials = sqlMaterials + '(?,?, ?, ?, ?, ?,?,?),'
                }
                sqlMaterials = sqlMaterials.slice(0, sqlMaterials.length - 1);
                sqlMaterials = `INSERT INTO osk.drawing_materials (id, idDrawing, id_item, percent, value, specific_units, L, h) VALUES ${sqlMaterials} ON DUPLICATE KEY UPDATE id=VALUES(id), id_item=VALUES(idDrawing), id_item=VALUES(id_item), percent=VALUES(percent), value=VALUES(value), specific_units=VALUES(specific_units), L=VALUES(L), h=values(h);`;
            }
            /* sql specification */
            if (bodyData.specifications) {
                for (let index = 0; index < bodyData.specifications.length / 12; index++) {
                    sqlSpecifications = sqlSpecifications + '(?,?,?,?,?),';
                    switch (bodyData.type_position) {
                        case 1:
                            rolledSp = rolledSp + '(?,?,?,?,?,?),';
                            break;
                        case 2:
                            hardwareSp = hardwareSp + '(?,?),';
                            break;
                        case 3:
                            materialSp = materialSp + '(?,?,?,?,?,?,?),';
                            break;
                        case 4:
                            purshSp = purshSp + '(?,?),';
                            break;
                        case 5:
                            drawSp = drawSp + '(?,?),';
                            break;
                    }
                }
                sqlSpecifications = sqlMaterials.slice(0, sqlMaterials.length - 1);
                sqlSpecifications = `INSERT INTO osk.drawing_specification (idSpecification, ind,  idDrawing, type_position, quantity) VALUES ${sqlMaterials};`;
                if (rolledSp !== '') {
                    rolledSp = `INSERT INTO osk.sprolled (idSpecification, id_item, L, d_b, h, plasma) VALUES ${rolledSp};`;
                }
                if (hardwareSp !== '') {
                    hardwareSp = `INSERT INTO osk.sphardware (idSpecification, id_item) VALUES ${hardwareSp};`;
                }
                if (materialSp !== '') {
                    materialSp = `INSERT INTO osk.spmaterial (idSpecification, id_item, percent, value, specific_units, L, h) VALUES ${hardwareSp};`;
                }
                if (purshSp !== '') {
                    purshSp = `INSERT INTO osk.sppurshasered (idSpecification, id_item) VALUES ${hardwareSp};`;
                }
                if (drawSp !== '') {
                    drawSp = `INSERT INTO osk.spdrawing (idSpecification, idDrawing) VALUES ${hardwareSp};`;
                }
            }

            if (bodyData.drawing[0] !== null) {
                const dataParams = [];
                let sql: string[] = [];
                sql = [sqlBlank, sqlBlank, sqlMaterials, sqlSpecifications].map(item => {
                    if (item !== '') {
                        return item;
                    }
                });
                for (const key in bodyData) {
                    if (key) {
                        dataParams.push(key);
                    }
                }
                const data = this.appService.executeMultiple(dataParams, ...sql)
            } else {
                const result: any = await this.appService.execute(sqlDrawings, bodyData.drawing);
                const newDrawingId = result[0]?.insertId;
                if (bodyData.materials) {
                    for (let i = 0; i < bodyData.materials.length / 8; i++) {
                        bodyData.materials[1 + 8 * i] = newDrawingId;
                    }
                    bodyData.blank[1] = newDrawingId;
                    bodyData.materials[1] = result[0].insertId;
                    await this.appService.executeMultiple([bodyData.blank, bodyData.materials], sqlBlank, sqlMaterials);
                } else {
                    bodyData.blank[1] = newDrawingId;
                    await this.appService.execute(sqlBlank, bodyData.blank);
                }
            }
            return { response: 'ok' }
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                return { serverError: 'Чертеж с таким номером уже существует!' };
            } else {
                return { serverError: error.message };
            }

        }
    }

    @Post('addMaterial')
    async addMaterial(@Body() bodyData) {
        try {
            const sqlMaterial = `INSERT INTO drawing_materials (id, idDrawing, id_item, percent, value, specific_units, L, h) VALUES (?,?,?,?,?,?,?,?)
            ON DUPLICATE KEY UPDATE percent=VALUES(percent),value=VALUES(value),specific_units=VALUES(specific_units),L=VALUES(L),h=VALUES(h);`;
            const data: any = await this.appService.execute(sqlMaterial, bodyData);
            if (bodyData[0] === null) {
                return { id: data[0].insertId };
            } else {
                return { response: 'ok' };
            }

        } catch (error) {
            return { serverError: error.message };
        }
    }


    @Get('getDrawingInfoFull/:idOrNumber/:findBy')
    findByID(@Param('idOrNumber') idOrNumber: number | string, @Param('findBy') findBy: string) {
        try {

            if (findBy === 'id') {
                return this.dravingSerice.findDrawingInfoFull(`idDrawing=${idOrNumber}`);
            } else {
                return this.dravingSerice.findDrawingInfoFull(`numberDrawing='${idOrNumber}'`);
            }
        } catch (error) {
            return { serverError: error.message };
        }
    }


    @Get('hasNumberDrawing/:number')
    async hasNumberDrawing(@Param('number') number: string) {
        try {
            const data: any = await this.appService.query(`SELECT idDrawing FROM drawings WHERE numberDrawing='${number}';`);
            if (data[0][0].length = 0) {
                return { response: 'no exist' }
            } else {
                return { response: 'exist' }
            }

        } catch (error) {
            return { serverError: error.message };
        }
    }


    @Delete('deletePositionSP/:idDrawing/:idParent/:ind')
    async deletePositionSP(@Param('idDrawing') idDrawing: number, @Param('idParent') idParent: number, @Param('ind') ind: number) {
        try {
            await this.appService.query(`DELETE FROM drawing_specification WHERE id=${idParent}`);
            await this.appService.query(`UPDATE drawing_specification SET ind = ind - 1 WHERE idDrawing = ${idDrawing} AND ind > ${ind};`)
            return { response: 'ok' };
        } catch (error) {
            return { serverError: error.message };
        }
    }


    @Put('changeIndPositionSP/:id1/:ind1/:id2/:ind2')
    async changePositionSP(@Param('id1') id1: number, @Param('ind1') ind1: number, @Param('id2') id2: number, @Param('ind2') ind2: number) {
        try {
            const sql1 = `UPDATE drawing_specification SET drawing_specification.ind = ${ind1} WHERE drawing_specification.id = ${id1};`
            const sql2 = `UPDATE drawing_specification SET drawing_specification.ind = ${ind2} WHERE drawing_specification.id = ${id2};`
            await this.appService.query(sql1, sql2);
            return { response: 'ok' };
        } catch (error) {
            return { serverError: error.message };
        }
    }


    @Get('scan')
    scan() {
        try {
            let pdfPath: string = '';
            if (process.env.NODE_ENV === 'development') {

                pdfPath = path.join(__dirname, '..', '..', 'pdf');
                console.log('development path is ', pdfPath);
            } else {
                pdfPath = path.join(__dirname, '..', 'pdf');
                console.log('production path is ', pdfPath);
            }
            const data: string[] = this.scanService.scanAllStaticResources(pdfPath);
            return {
                scan: data.map(path => path.slice(path.indexOf('pdf'), path.length)).filter(slicedPath => {
                    return slicedPath !== 'pdf\\notFound';
                })
            }
        } catch (error) {
            return { serverError: error.message };
        }
    }
}
