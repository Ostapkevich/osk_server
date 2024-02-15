import { Controller, Put, Body, Param, Post, Get, Delete } from '@nestjs/common';
import { AppService } from 'src/app.service';
import { ScanService } from 'src/drawings/scan.service';
import * as path from 'path';

@Controller('drawings')
export class DrawingsController {
    constructor(protected appService: AppService, private scanService: ScanService) { }

    @Post('saveDrawing')
    async saveDrawing(@Body() bodyData) {
        try {
            // sqlDrawings = `INSERT INTO osk.drawings (idDrawing, numberDrawing, isp, nameDrawing, weight, type_blank, has_material, L, d_b, h, s, path, isDetail) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE idDrawing=VALUES(idDrawing), numberDrawing=VALUES(numberDrawing), isp=VALUES(isp), nameDrawing=VALUES(nameDrawing), weight=VALUES(weight), type_blank=VALUES(type_blank), has_material=VALUES(has_material), L=VALUES(L), d_b=VALUES(d_b), h=VALUES(h), s=VALUES(s), path=VALUES(path), isDetail=VALUES(isDetail);`;
            const sqlDrawing = `INSERT INTO osk.drawings (idDrawing, numberDrawing, nameDrawing, weight, s, path) VALUES ( ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE idDrawing=VALUES(idDrawing), numberDrawing=VALUES(numberDrawing), nameDrawing=VALUES(nameDrawing), weight=VALUES(weight), path=VALUES(path) ;`;
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
            return { response: data[0].insertId };
        } catch (error) {

            return { serverError: error.message };
        }
    }

    @Delete('deleteBlank/:typeBlank/:id/:idDrawing/:newTypeBlank')
    async deleteBlank(@Param('typeBlank') typeBlank: number, @Param('id') id: number, @Param('idDrawing') idDrawing: number, @Param('newTypeBlank') newTypeBlank: number) {
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


    @Post('save/:typeBlank')
    async saveUnits(@Param('typeBlank') typeBlank: string,
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


    @Get('findByID/:id')
    async findByID(@Param('id') id: number) {
        try {
            return this.findBy(`idDrawing=${id}`);
        } catch (error) {
            return { serverError: error.message };
        }
    }


    @Get('findByNumber/:number')
    async findByNumber(@Param('number') drawingNumber: string) {
        try {
            // const sql = `SELECT idDrawing, numberDrawing, nameDrawing, weight,type_blank< s, path FROM osk.drawings WHERE numberDrawing='${number}';`;

            return this.findBy(`numberDrawing='${drawingNumber}'`);
        } catch (error) {
            return { serverError: error.message };
        }
    }

    async findBy(partOfSql: string) {
        try {
            const sqlDrawing = `SELECT idDrawing, numberDrawing, nameDrawing, weight, type_blank, s, path FROM osk.drawings WHERE ${partOfSql};`
            const dataDrawing: any = await this.appService.query(sqlDrawing);

            let dataBlank: any = undefined;
            let dataMaterial: any = undefined;
            let dataSP: any = undefined;

            if (dataDrawing[0][0][0]?.type_blank) {
                const typeBlank: number = dataDrawing[0][0][0].type_blank;
                let sqlBlank = '';
                switch (typeBlank) {
                    case 1:
                        sqlBlank = `SELECT id, drawing_blank_rolled.id_item, plasma, L, d_b, h, allowance, rolled.name_item, rolled.weight, rolled.d, rolled.t, rolled_type.uselength  FROM drawing_blank_rolled
                        INNER JOIN rolled ON rolled.id_item=drawing_blank_rolled.id_item
                        INNER JOIN rolled_type ON rolled.id_type=rolled_type.id_type
                       WHERE idDrawing=${dataDrawing[0][0][0].idDrawing};`;
                        break;
                    case 2:
                        sqlBlank = `SELECT id, drawing_blank_hardware.id_item, hardware.name_item, hardware.weight FROM drawing_blank_hardware
                        INNER JOIN hardware ON drawing_blank_hardware.id_item=hardware.id_item
                        WHERE idDrawing=${dataDrawing[0][0][0].idDrawing};`;
                        break;
                    case 3:
                        sqlBlank = `SELECT id, drawing_blank_material.id_item, drawing_blank_material.percent, drawing_blank_material.value, drawing_blank_material.specific_units, L, h, material.name_item, material.units  FROM drawing_blank_material
                            INNER JOIN material ON drawing_blank_material.id_item=material.id_item
                            WHERE idDrawing=${dataDrawing[0][0][0].idDrawing};`;
                        break;
                    case 4:
                        sqlBlank = `SELECT id, drawing_blank_purshased.id_item, purchased.name_item, purchased.weight FROM drawing_blank_purshased
                            INNER JOIN purchased ON drawing_blank_purshased.id_item=purchased.id_item
                            WHERE idDrawing=${dataDrawing[0][0][0].idDrawing};`;
                        break;
                }

                dataBlank = await this.appService.query(sqlBlank);
            }
           /*  console.log('dataDrawing',dataDrawing[0][0][0])
            console.log('dataBlank',dataBlank[0][0][0]) */
            return { drawing: dataDrawing?dataDrawing[0][0][0]:undefined , blank: dataBlank?dataBlank[0][0][0]:undefined };
        } catch (error) {
            console.log(error)
            return { serverError: error.message };
        }
    }


    @Get('scan')
    scan() {
        try {
            const data: string[] = this.scanService.scanAllStaticResources(path.join(__dirname, '../..', 'drawings'))
            return { scan: data.map(path => path.slice(__dirname.length - 19)) }
        } catch (error) {
            return { serverError: error.message };
        }
    }
}
