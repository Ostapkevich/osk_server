import { Injectable } from '@nestjs/common';
import { AppService } from 'src/app.service';

@Injectable()
export class DrawingService {

    constructor(private appService: AppService) { }

    async findBy(partOfSql: string) {
        try {
            const sqlDrawing = `SELECT idDrawing, numberDrawing, nameDrawing, weight, type_blank, s, path FROM osk.drawings WHERE ${partOfSql};`
            const dataDrawing: any = await this.appService.query(sqlDrawing);

            let dataBlank: any = undefined;

            let dataSP: any = undefined;

            if (dataDrawing[0][0][0]?.type_blank) {
                const typeBlank: number = dataDrawing[0][0][0].type_blank;
                let sqlBlank = '';
                switch (typeBlank) {
                    case 1:
                        sqlBlank = `SELECT id, drawing_blank_rolled.id_item, plasma, L, d_b, h, allowance, rolled.id_item AS idItem,  rolled.name_item, rolled.weight, rolled.d, rolled.t, rolled_type.uselength  FROM drawing_blank_rolled
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

            const sqlMaterial = `SELECT drawing_materials.id, drawing_materials.idDrawing, drawing_materials.id_item, material.name_item, material.units, drawing_materials.percent, drawing_materials.value, drawing_materials.specific_units, drawing_materials.L, drawing_materials.h
           FROM drawing_materials INNER JOIN material ON drawing_materials.id_item=material.id_item WHERE drawing_materials.idDrawing=${dataDrawing[0][0][0].idDrawing}`;
            const dataMaterial: any = await this.appService.query(sqlMaterial);

            /* SP */
            const positions: any = await this.appService.query(`SELECT id, type_position FROM drawing_specification WHERE  idDrawing= ${dataDrawing[0][0][0].idDrawing} ORDER BY ind`);
            let positionsSP: any[] = [];
            for (const item of positions[0][0]) {
                positionsSP.push(await this.selectPositionSP(item.type_position, item.id));
            }
            console.log(positionsSP)
            return { drawing: dataDrawing ? dataDrawing[0][0][0] : undefined, blank: dataBlank ? dataBlank[0][0][0] : undefined, materials: dataMaterial ? dataMaterial[0][0] : undefined, positionsSP: positionsSP.length === 0 ? undefined : positionsSP };
        } catch (error) {
            console.log('mainError ', error)
            return { serverError: error.message };
        }
    }

    async selectPositionSP(typePosition: number, id: number) {
        try {
            let sqlPosition = '';
            switch (typePosition) {
                case 1:
                    sqlPosition = `SELECT drawing_specification.id AS idParent, drawing_specification.ind, drawing_specification.quantity, sprolled.id_sprolled AS id, sprolled.id_item AS id, sprolled.plasma, sprolled.L, sprolled.d_b, sprolled.h, sprolled.name, 'б/ч' AS number_item, rolled_type.uselength AS useLenth, rolled.name_item, rolled.id_item AS idItem,
                    CASE
                    WHEN rolled_type.uselength=1 THEN sprolled.L * rolled.weight/1000  
                    ELSE 
                        CASE 
                        WHEN sprolled.h IS NULL THEN (sprolled.d_b *sprolled.d_b )*rolled.weight/1000000
                        ELSE (sprolled.d_b * sprolled.h ) * rolled.weight/1000000
                        END
                    END  AS weight 
                    FROM drawing_specification
                    INNER JOIN sprolled ON drawing_specification.id=sprolled.id 
                    INNER JOIN rolled ON rolled.id_item=sprolled.id_item
                    INNER JOIN rolled_type ON rolled.id_type=rolled_type.id_type
                    WHERE drawing_specification.id=${id};`;
                    break;
                case 2:
                    sqlPosition = `SELECT drawing_specification.id AS idParent, drawing_specification.ind, drawing_specification.quantity, sphardware.id_sphardware AS id, sphardware.id_item, sphardware.name, hardware.weight, hardware.name_item FROM sphardware
                    INNER JOIN sphardware ON drawing_specification.id=sphardware.id     
                    INNER JOIN hardware ON sphardware.id_item=hardware.id_item
                        WHERE sphardware.id=${id};`;
                    break;
                case 3:
                    sqlPosition = `SELECT drawing_specification.id AS idParent, drawing_specification.ind, drawing_specification.quantity, spmaterial.id_spmaterial AS id, spmaterial.id_item, spmaterial.percent, spmaterial.value, spmaterial.specific_units, spmaterial.L, spmaterial.h, spmaterial.name, material.name_item, material.units  FROM spmaterial
                    INNER JOIN spmaterial ON drawing_specification.id=spmaterial.id        
                    INNER JOIN material ON spmaterial.id_item=material.id_item
                        WHERE spmaterial.id=${id};`;
                    break;
                case 4:
                    sqlPosition = `SELECT drawing_specification.id AS idParent, drawing_specification.ind, drawing_specification.quantity, sppurshasered.id_sppurshasered AS id, sppurshasered.id_item, sppurshasered.name, purchased.name_item, purchased.weight FROM sppurshasered
                    INNER JOIN sppurshasered ON drawing_specification.id=sppurshasered.id        
                    INNER JOIN purchased ON sppurshasered.id_item=purchased.id_item
                            WHERE sppurshasered.id=${id};`;
                    break;
                case 5:
                    const typeBlank: any = await this.appService.query(`SELECT drawings.type_blank, drawings.idDrawing FROM drawings INNER JOIN spdrawing ON drawings.idDrawing=spdrawing.idDrawing WHERE spdrawing.id=${id};`);
                    sqlPosition = this.selectDrawingPositionSP(typeBlank[0][0][0].type_blank, typeBlank[0][0][0].idDrawing, id);
                    break;
            }
            const dataBlank: any = await this.appService.query(sqlPosition);

            return dataBlank[0][0][0];
        } catch (error) {
            throw error;
        }
    }


    selectDrawingPositionSP(typeBlank: number, idDrawing: number, id: number): string {
        try {
            let sqlDrawing = '';
            switch (typeBlank) {
                case 1:
                    sqlDrawing = `SELECT drawing_specification.id AS idParent, drawing_specification.type_position, drawing_specification.ind, drawing_specification.quantity, drawings.numberDrawing AS number_item, drawings.nameDrawing AS name, drawings.weight, drawing_blank_rolled.plasma, (drawing_blank_rolled.L +drawing_blank_rolled.allowance) AS len, drawings.idDrawing AS idItem, (drawing_blank_rolled.d_b+drawing_blank_rolled.allowance) AS dw, (drawing_blank_rolled.h+drawing_blank_rolled.allowance) AS h, rolled.name_item, rolled.d, rolled.t, rolled.name_item, rolled_type.uselength AS useLenth, 
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
                    sqlDrawing = `SELECT drawing_specification.id AS idParent, drawing_specification.ind,drawing_specification.quantity,drawings.numberDrawing AS number_item, drawings.nameDrawing AS name, drawings.weight, hardware.name_item, hardware.weight FROM drawing_specification
                    INNER JOIN spdrawing ON drawing_specification.id=spdrawing.id
                    INNER JOIN drawings ON drawings.idDrawing=spdrawing.idDrawing
                    INNER JOIN drawing_blank_hardware ON spdrawing.idDrawing=drawing_blank_hardware.idDrawing
                    INNER JOIN hardware ON hardware.id_item=drawing_blank_hardware.id_item
                    INNER JOIN hardware_type ON hardware.id_type=hardware_type.id_type
                   WHERE drawing_specification.id=${id};`;
                    break;
                case 3:
                    sqlDrawing = `SELECT drawing_specification.id AS idParent, drawing_specification.ind, drawing_specification.quantity, drawings.numberDrawing AS number_item, drawings.nameDrawing AS name, drawings.weight, drawing_blank_material.id_item, drawing_blank_material.percent, drawing_blank_material.value, drawing_blank_material.specific_units, L, h, material.name_item, material.units  FROM drawing_specification
                    INNER JOIN spdrawing ON drawing_specification.id=spdrawing.id
                    INNER JOIN drawings ON drawings.idDrawing=spdrawing.idDrawing
                    INNER JOIN drawing_blank_material ON spdrawing.idDrawing=drawing_blank_material.idDrawing
                    INNER JOIN material ON material.id_item=drawing_blank_material.id_item
                    INNER JOIN material_type ON material.id_type=material_type.id_type
                   WHERE drawing_specification.id=${id};`;
                    break;
                case 4:
                    sqlDrawing = `SELECT drawing_specification.id AS idParent, drawing_specification.ind, drawing_specification.quantity, drawings.numberDrawing AS number_item, drawings.nameDrawing AS name, drawings.weight, drawing_blank_purshased.id_item, purchased.name_item, purchased.weight FROM drawing_specification
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
