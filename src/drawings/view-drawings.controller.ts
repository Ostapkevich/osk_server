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
    

         const params=[];
          let sqlDrawings = `SELECT idDrawing AS id_item, numberDrawing AS number_item, nameDrawing AS name_item, weight, path FROM drawings WHERE 1=1`;
      if (searchParams.idDrawing) {
         sqlDrawings += " AND " + 'idDrawing=?';
        params.push(searchParams.idDrawing);
      }
      if (searchParams.numberDrawing) {
        sqlDrawings += " AND " + `LOWER (numberDrawing) LIKE LOWER (?)`;
        params.push(searchParams.numberDrawing);
      }
      if (searchParams.nameDrawing) {
        sqlDrawings += " AND " + 'LOWER (nameDrawing) LIKE LOWER (?)';
        params.push(searchParams.nameDrawing);
      }
      if (searchParams.min) {
        sqlDrawings += " AND " + 'weight>=?';
        params.push(searchParams.min);
      }
      if (searchParams.max) {
        sqlDrawings += " AND " + 'weight<=?';
        params.push(searchParams.max);
      }
     const data = await this.appService.execute(sqlDrawings,params);
    
     return { drawings: data[0] };
    } catch (error) {
      console.log(error)
      return { serverError: error.message };
    }
  }



}
