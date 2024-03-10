import { Injectable } from '@nestjs/common';
import { AppService } from 'src/app.service';

@Injectable()
export class DrawingService {

    constructor(private appService: AppService) { }

    async findDrawingInfoFull(partOfSql: string) {
        try {
            const drawingInfo: any = await this.drawingInfo(partOfSql);
            if (!drawingInfo) {
                return { notFound: 'not found' };
            }
            let dataBlank: any;
            if (drawingInfo.type_blank) {
                dataBlank = await this.blankInfo(drawingInfo.idDrawing, drawingInfo.type_blank);
            }
            const dataMaterial: any = await this.materialInfo(drawingInfo.idDrawing);
            const dataSP: any = await this.spInfo(drawingInfo.idDrawing);

            return { drawing: drawingInfo, blank: dataBlank, materials: dataMaterial, positionsSP: dataSP };
        } catch (error) {
            return { serverError: error.message };
        }
    }

    async drawingInfo(partOfSql: string): Promise<any[]> | undefined {
        try {
            const sqlDrawing = `SELECT idDrawing, numberDrawing, nameDrawing, weight, type_blank, s, path FROM osk.drawings WHERE ${partOfSql};`
            const dataDrawing: any = await this.appService.query(sqlDrawing);
            return dataDrawing[0][0][0];
        } catch (error) {
            throw error;
            //return { serverError: error.message };
        }
    }

    async blankInfo(idDrawing: number, typeBlank: number) {
        try {
            let dataBlank: any = undefined;
            let sqlBlank = '';
            switch (typeBlank) {
                case 1:
                    sqlBlank = `SELECT id, drawing_blank_rolled.id_item, plasma, L, d_b, h, allowance, rolled.id_item ,  rolled.name_item, rolled.weight, rolled.d, rolled.t, rolled_type.uselength  FROM drawing_blank_rolled
                        INNER JOIN rolled ON rolled.id_item=drawing_blank_rolled.id_item
                        INNER JOIN rolled_type ON rolled.id_type=rolled_type.id_type
                       WHERE idDrawing=${idDrawing};`;
                    break;
                case 2:
                    sqlBlank = `SELECT id, drawing_blank_hardware.id_item, hardware.name_item, hardware.weight FROM drawing_blank_hardware
                        INNER JOIN hardware ON drawing_blank_hardware.id_item=hardware.id_item
                        WHERE idDrawing=${idDrawing};`;
                    break;
                case 3:
                    sqlBlank = `SELECT id, drawing_blank_material.id_item, drawing_blank_material.percent, drawing_blank_material.value, drawing_blank_material.specific_units, L, h, material.name_item, material.units  FROM drawing_blank_material
                            INNER JOIN material ON drawing_blank_material.id_item=material.id_item
                            WHERE idDrawing=${idDrawing};`;
                    break;
                case 4:
                    sqlBlank = `SELECT id, drawing_blank_purshased.id_item, purchased.name_item, purchased.weight FROM drawing_blank_purshased
                            INNER JOIN purchased ON drawing_blank_purshased.id_item=purchased.id_item
                            WHERE idDrawing=${idDrawing};`;
                    break;
            }
            dataBlank = await this.appService.query(sqlBlank);
            return dataBlank ? dataBlank[0][0][0] : undefined;
        } catch (error) {
            throw error;
            //return { serverError: error.message };
        }
    }

    async materialInfo(idDrawing: number) {
        try {
            const sqlMaterial = `SELECT drawing_materials.id, drawing_materials.idDrawing, drawing_materials.id_item, material.name_item, material.units, drawing_materials.percent, drawing_materials.value, drawing_materials.specific_units, drawing_materials.L, drawing_materials.h
           FROM drawing_materials INNER JOIN material ON drawing_materials.id_item=material.id_item WHERE drawing_materials.idDrawing=${idDrawing}`;
            const dataMaterial: any = await this.appService.query(sqlMaterial);
            return dataMaterial ? dataMaterial[0][0] : undefined;
        } catch (error) {
            throw error;
            // return { serverError: error.message };
        }
    }

    async spInfo(idDrawing: number) {
        try {
            const positions: any = await this.appService.query(`SELECT id, type_position FROM drawing_specification WHERE  idDrawing= ${idDrawing} ORDER BY ind`);
            let positionsSP: any[] = [];
            for (const item of positions[0][0]) {
                positionsSP.push(await this.selectPositionSP(item.type_position, item.id));
            }
            return positionsSP.length === 0 ? undefined : positionsSP;
        } catch (error) {
            throw error;
            // return { serverError: error.message };
        }
    }




    async selectPositionSP(typePosition: number, id: number) {
        try {
            let sqlPosition = '';
            let isSB:any;
            switch (typePosition) {
                case 1:
                    sqlPosition = `SELECT drawing_specification.id AS idParent, drawing_specification.type_position, drawing_specification.quantity, sprolled.id_sprolled AS idChild, sprolled.id_item AS idItem, sprolled.plasma, sprolled.L AS len, sprolled.d_b AS dw, sprolled.h, sprolled.name AS nameDrawing , 'б/ч' AS numberDrawing, rolled_type.uselength, rolled.name_item, rolled.weight
                    FROM drawing_specification
                    INNER JOIN sprolled ON drawing_specification.id=sprolled.id 
                    INNER JOIN rolled ON rolled.id_item=sprolled.id_item
                    INNER JOIN rolled_type ON rolled.id_type=rolled_type.id_type
                    WHERE drawing_specification.id=${id};`;
                    break;
                case 2:
                    sqlPosition = `SELECT drawing_specification.id AS idParent, drawing_specification.type_position, drawing_specification.quantity, sphardware.id_sphardware AS idChild, sphardware.id_item AS idItem, sphardware.name AS nameDrawing, 'б/ч' AS numberDrawing, hardware.weight, hardware.name_item 
                    FROM drawing_specification
                    INNER JOIN sphardware ON drawing_specification.id=sphardware.id     
                    INNER JOIN hardware ON sphardware.id_item=hardware.id_item
                    WHERE sphardware.id=${id};`;
                    break;
                case 3:
                    sqlPosition = `SELECT drawing_specification.id AS idParent, drawing_specification.type_position, drawing_specification.quantity, spmaterial.id_spmaterial AS idChild, spmaterial.id_item AS idItem, spmaterial.percent, spmaterial.value, spmaterial.specific_units , spmaterial.L AS len, spmaterial.h, spmaterial.name AS nameDrawing, 'б/ч' AS number_item, material.name_item, material.units
                    FROM drawing_specification
                    INNER JOIN spmaterial ON drawing_specification.id=spmaterial.id        
                    INNER JOIN material ON spmaterial.id_item=material.id_item
                        WHERE spmaterial.id=${id};`;
                    break;
                case 4:
                    sqlPosition = `SELECT drawing_specification.id AS idParent, drawing_specification.type_position, drawing_specification.quantity, sppurshasered.id_sppurshasered AS idChild, sppurshasered.id_item AS idItem, sppurshasered.name AS nameDrawing, 'б/ч' AS numberDrawing, purchased.name_item, purchased.weight
                    FROM drawing_specification
                    INNER JOIN sppurshasered ON drawing_specification.id=sppurshasered.id        
                    INNER JOIN purchased ON sppurshasered.id_item=purchased.id_item
                            WHERE sppurshasered.id=${id};`;
                    break;
                case 5:
                    const typeBlank: any = await this.appService.query(`SELECT drawings.type_blank, drawings.idDrawing FROM drawings INNER JOIN spdrawing ON drawings.idDrawing=spdrawing.idDrawing WHERE spdrawing.id=${id};`);
                    sqlPosition = this.selectDrawingPositionSP(typeBlank[0][0][0].type_blank, typeBlank[0][0][0].idDrawing, id);
                   isSB= await this.appService.query(`SELECT CASE WHEN EXISTS (SELECT * FROM drawing_specification WHERE idDrawing=${typeBlank[0][0][0].idDrawing}) THEN 1 ELSE 0 END AS isSB;`);
                   break;
            }
           
            const dataPosition: any = await this.appService.query(sqlPosition);
            if (typePosition===5) {
                dataPosition[0][0][0].isSB=isSB[0][0][0].isSB;
            }
            return dataPosition[0][0][0];
        } catch (error) {
            console.log(error)
            throw error;
        }
    }


    selectDrawingPositionSP(typeBlank: number, idDrawing: number, id: number): string {
        try {
            let sqlDrawing = '';
            switch (typeBlank) {
                case 1:
                    sqlDrawing = `SELECT drawing_specification.id AS idParent, drawing_specification.type_position, drawing_specification.quantity, spdrawing.id_spdrawing AS idChild, drawings.numberDrawing, drawings.nameDrawing , drawings.weight, drawing_blank_rolled.plasma, (drawing_blank_rolled.L +drawing_blank_rolled.allowance) AS len, drawings.idDrawing AS idItem, (drawing_blank_rolled.d_b+drawing_blank_rolled.allowance) AS dw, (drawing_blank_rolled.h+drawing_blank_rolled.allowance) AS h, rolled.name_item,  rolled_type.uselength, 
                    CASE
                        WHEN rolled_type.uselength=1 THEN (drawing_blank_rolled.L + drawing_blank_rolled.allowance)*rolled.weight/1000  
                        ELSE 
                            CASE 
                            WHEN drawing_blank_rolled.h IS NULL THEN ((drawing_blank_rolled.d_b + drawing_blank_rolled.allowance)*(drawing_blank_rolled.d_b + drawing_blank_rolled.allowance))*rolled.weight/1000000
                            ELSE ((drawing_blank_rolled.d_b + drawing_blank_rolled.allowance)*(drawing_blank_rolled.h + drawing_blank_rolled.allowance))*rolled.weight/1000000
                            END

                    END  AS value 
                    FROM drawing_specification
                    INNER JOIN spdrawing ON drawing_specification.id=spdrawing.id
                    INNER JOIN drawings ON drawings.idDrawing=spdrawing.idDrawing
                    INNER JOIN drawing_blank_rolled ON spdrawing.idDrawing=drawing_blank_rolled.idDrawing
                    INNER JOIN rolled ON rolled.id_item=drawing_blank_rolled.id_item
                    INNER JOIN rolled_type ON rolled.id_type=rolled_type.id_type
                   WHERE drawing_specification.id=${id};`;
                    break;
                case 2:
                    sqlDrawing = `SELECT drawing_specification.id AS idParent, drawing_specification.type_position, drawing_specification.quantity, spdrawing.id_spdrawing AS idChild,drawings.numberDrawing, drawings.idDrawing AS idItem, drawings.nameDrawing, drawings.weight, hardware.name_item, hardware.weight FROM drawing_specification
                    INNER JOIN spdrawing ON drawing_specification.id=spdrawing.id
                    INNER JOIN drawings ON drawings.idDrawing=spdrawing.idDrawing
                    INNER JOIN drawing_blank_hardware ON spdrawing.idDrawing=drawing_blank_hardware.idDrawing
                    INNER JOIN hardware ON hardware.id_item=drawing_blank_hardware.id_item
                    INNER JOIN hardware_type ON hardware.id_type=hardware_type.id_type
                   WHERE drawing_specification.id=${id};`;
                    break;
                case 3:
                    sqlDrawing = `SELECT drawing_specification.id AS idParent, drawing_specification.type_position, drawing_specification.quantity,spdrawing.id_spdrawing AS idChild, drawings.numberDrawing, drawings.idDrawing AS idItem, drawings.nameDrawing , drawings.weight, drawing_blank_material.percent, drawing_blank_material.value, drawing_blank_material.specific_units, drawing_blank_material.L AS len, drawing_blank_material.h, material.name_item, material.units   FROM drawing_specification
                    INNER JOIN spdrawing ON drawing_specification.id=spdrawing.id
                    INNER JOIN drawings ON drawings.idDrawing=spdrawing.idDrawing
                    INNER JOIN drawing_blank_material ON spdrawing.idDrawing=drawing_blank_material.idDrawing
                    INNER JOIN material ON material.id_item=drawing_blank_material.id_item
                    INNER JOIN material_type ON material.id_type=material_type.id_type
                   WHERE drawing_specification.id=${id};`;
                    break;
                case 4:
                    sqlDrawing = `SELECT drawing_specification.id AS idParent, drawing_specification.type_position, drawing_specification.quantity,spdrawing.id_spdrawing AS idChild, drawings.numberDrawing, drawings.idDrawing AS idItem drawings.nameDrawing , drawings.weight, purchased.name_item, purchased.weight FROM drawing_specification
                    INNER JOIN spdrawing ON drawing_specification.id=spdrawing.id
                    INNER JOIN drawings ON drawings.idDrawing=spdrawing.idDrawing
                    INNER JOIN drawing_blank_purshased ON spdrawing.idDrawing=drawing_blank_purshased.idDrawing
                    INNER JOIN purchased ON purchased.id_item=drawing_blank_purshased.id_item
                    INNER JOIN purchased_type ON purchased.id_type=purchased_type.id_type
                   WHERE drawing_specification.id=${id};`;
                    break;
            }
            return sqlDrawing;
        } catch (error) {
            throw error;
        }
    }
}
