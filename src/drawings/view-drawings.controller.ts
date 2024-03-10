import { Controller, Get, Body, Query } from '@nestjs/common';
import { AppService } from 'src/app.service';

interface Idrawing {
  idDrawing?: number,
  numberDrawing?: string,
  nameDrawing?: string,
  min?: number,
  max?: number,
}

@Controller('viewDrawing')
export class ViewDrawingsController {

  constructor(private appService: AppService) {

  }


  @Get('selectDrawings')
  async viewDrawings(@Query() searchParams) {
    try {
      const params = [];
      // SELECT idDrawing AS id_item, numberDrawing AS number_item, nameDrawing AS name_item, weight, path FROM drawings WHERE 1=1
      let sqlDrawings = `SELECT idDrawing, type_blank FROM drawings WHERE 1=1 `;
      if (searchParams.idDrawing) {
        sqlDrawings += " AND " + 'idDrawing=? ORDER BY drawings.idDrawing';
        params.push(searchParams.idDrawing);
      }
      if (searchParams.numberDrawing) {
        sqlDrawings += " AND " + `LOWER (numberDrawing) LIKE LOWER (?) ORDER BY drawings.idDrawing`;
        params.push(searchParams.numberDrawing);
      }
      if (searchParams.nameDrawing) {
        sqlDrawings += " AND " + 'LOWER (nameDrawing) LIKE LOWER (?) ORDER BY drawings.idDrawing';
        params.push(searchParams.nameDrawing);
      }
      if (searchParams.min) {
        sqlDrawings += " AND " + 'weight>=? ORDER BY drawings.idDrawing';
        params.push(searchParams.min);
      }
      if (searchParams.max) {
        sqlDrawings += " AND " + 'weight<=? ORDER BY drawings.idDrawing';
        params.push(searchParams.max);
      }
      let data: any = await this.appService.execute(sqlDrawings, params);
      console.log(data[0])
      if ((data[0] as []).length > 0) {
        const sqlArray: string[] = [];
        let sqlDrawing = '';

        for (const item of data[0]) {
          switch (item.type_blank) {
            case 1:

              sqlDrawing = `SELECT drawings.idDrawing , drawings.numberDrawing, drawings.nameDrawing, drawings.weight, drawings.path, drawings.weight, drawing_blank_rolled.plasma, (drawing_blank_rolled.L +drawing_blank_rolled.allowance) AS len, (drawing_blank_rolled.d_b+drawing_blank_rolled.allowance) AS dw, (drawing_blank_rolled.h+drawing_blank_rolled.allowance) AS h, rolled.name_item, rolled_type.uselength, 
            CASE
                WHEN rolled_type.uselength=1 THEN (drawing_blank_rolled.L + drawing_blank_rolled.allowance)*rolled.weight/1000  
                ELSE 
                    CASE 
                    WHEN drawing_blank_rolled.h IS NULL THEN ((drawing_blank_rolled.d_b + drawing_blank_rolled.allowance)*(drawing_blank_rolled.d_b + drawing_blank_rolled.allowance))*rolled.weight/1000000
                    ELSE ((drawing_blank_rolled.d_b + drawing_blank_rolled.allowance)*(drawing_blank_rolled.h + drawing_blank_rolled.allowance))*rolled.weight/1000000
                    END
            END AS value 
            FROM drawings
            INNER JOIN drawing_blank_rolled ON drawings.idDrawing=drawing_blank_rolled.idDrawing
            INNER JOIN rolled ON rolled.id_item=drawing_blank_rolled.id_item
            INNER JOIN rolled_type ON rolled.id_type=rolled_type.id_type
           WHERE drawings.idDrawing=${item.idDrawing};`;
            
              break;
            case 2:
              sqlDrawing = `SELECT drawings.idDrawing, drawings.numberDrawing, drawings.nameDrawing, drawings.weight, drawings.path, drawings.weight, hardware.name_item, hardware.weight
                FROM drawings
                INNER JOIN drawing_blank_hardware ON drawings.idDrawing=drawing_blank_hardware.idDrawing
                INNER JOIN hardware ON hardware.id_item=drawing_blank_hardware.id_item
                INNER JOIN hardware_type ON hardware.id_type=hardware_type.id_type
               WHERE drawings.idDrawing=${item.idDrawing};`;
              break;
            case 3:
              sqlDrawing = `SELECT drawings.idDrawing, drawings.numberDrawing, drawings.nameDrawing, drawings.weight, drawings.path, drawings.weight, drawing_blank_material.percent, drawing_blank_material.value, drawing_blank_material.specific_units, drawing_blank_material.L AS len, drawing_blank_material.h, material.name_item, material.units 
                FROM drawings
                INNER JOIN drawing_blank_material ON drawings.idDrawing=drawing_blank_material.idDrawing
                INNER JOIN material ON material.id_item=drawing_blank_material.id_item
                INNER JOIN material_type ON material.id_type=material_type.id_type
                WHERE drawings.idDrawing=${item.idDrawing};`;
              break;
            case 4:
              sqlDrawing = `SELECT drawings.idDrawing, drawings.numberDrawing, drawings.nameDrawing, drawings.weight, drawings.path, drawings.weight, purchased.name_item, purchased.weight 
                FROM drawings
                INNER JOIN drawing_blank_purshased ON drawings.idDrawing=drawing_blank_purshased.idDrawing
                INNER JOIN purchased ON purchased.id_item=drawing_blank_purshased.id_item
                INNER JOIN purchased_type ON purchased.id_type=purchased_type.id_type
                WHERE drawings.idDrawing=${item.idDrawing};`;
              break;
            default:
              sqlDrawing = `SELECT drawings.idDrawing AS idItem, drawings.numberDrawing, drawings.nameDrawing, drawings.weight, drawings.path, drawings.weight  FROM drawings WHERE drawings.idDrawing=${item.idDrawing};`
              break;
          }
          sqlArray.push(sqlDrawing);
        }
      
        data = await this.appService.query(...sqlArray)
        console.log(sqlArray)  
      } else{
        return { notFound: 'not found' };
      }
    
     // console.log('resalts ', data[0][0])
      return { drawings: data[0][0] };
    } catch (error) {
      console.log(error)
      return { serverError: error.message };
    }
  }



}
