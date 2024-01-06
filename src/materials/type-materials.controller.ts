import { Controller, Get, Param, Put, Body, Delete } from '@nestjs/common';
import { AppService } from 'src/app.service';

@Controller('types')
export class TypeMaterialsController {
    constructor(private appService: AppService) { }

    @Get('getTypes/:table')
    async loadTypes(@Param('table') table: string) {
        try {
            let sql = '';
            switch (table) {
                case 'rolled_type':
                    sql = `SELECT id_type, name_type, ind, uselength FROM ${table} WHERE id_type <> 1 ORDER BY ind;`
                    break;
                case 'hardware_type':
                    sql = `SELECT id_type, name_type, ind FROM ${table} WHERE id_type <> 1 ORDER BY ind;`
                    break;
                case 'material_type':
                    sql = `SELECT id_type, name_type, ind FROM ${table} WHERE id_type <> 1 ORDER BY ind;`
                    break;
                case 'purchased_type':
                    sql = `SELECT id_type, name_type, ind FROM ${table} WHERE id_type <> 1 ORDER BY ind;`
            }

            const typesMaterialData = await this.appService.query(sql);
            return { typesMaterial: typesMaterialData[0][0] };
        } catch (error) {

            return { serverError: 'Ошибка сервера:' + error.message };
        }
    }

    @Put('saveTypes/:table')
    async saveUnits(@Param('table') table: string,
        @Body() bodyData) {
        try {

            let updateInsertString: string = '';
            for (const item of bodyData) {
                updateInsertString =
                    updateInsertString +
                    `(${item.id_type}, '${item.name_type}', ${item.ind}, ${item.uselength}),`;
            }
            updateInsertString = `INSERT INTO osk.${table} (id_type, name_type, ind, uselength)
    VALUES ${updateInsertString.slice(
                0,
                updateInsertString.length - 1,
            )}
    ON DUPLICATE KEY UPDATE
     name_type=VALUES(name_type),
     ind=VALUES(ind),
     uselength=VALUES(uselength);`;
            await this.appService.query(updateInsertString);
            const data = this.loadTypes(table);
            return (data);
        } catch (error) {
            console.log(error)
            return { serverError: error.message };
        }
    }

    @Put('update/:table')
    async opdate(@Param('table') table: string, @Body() bodyData) {
        try {
            let arrData: Array<any> = [];
            for (const key in bodyData) {
                if (Object.prototype.hasOwnProperty.call(bodyData, key)) {
                    let param = bodyData[key];
                    arrData.push(param);
                }
            }
            let sql = '';
            switch (table) {
                case 'rolled_type':
                    sql = `UPDATE ${table} SET name_type=?, uselength=? WHERE id_type=?;`;
                    break;
                default:
                    break;
            }
            const data = await this.appService.execute(sql, arrData);
            if (data[0]['affectedRows'] === 1) {
                const data = this.loadTypes(table);
                return (data);
            }
        } catch (error) {
            return { serverError: 'Ошибка сервера: ' + error.message };
        }
    }

    @Delete('deleteType/:table/:id')
    async delete(@Param('table') table: string, @Param('id') id: number) {
        try {
            let sql = `DELETE FROM ${table} WHERE id_type=?;`;
            const data = await this.appService.execute(sql, [id]);
            if (data[0]['affectedRows'] === 1) {
                const data = this.loadTypes(table);
                return (data);
            }
        } catch (error) {
           if (error.errno === 1451) {
                return { serverError: 'Нельзя удалить данный тип материала, поскольку в базе имееются данные, связанные с этим типом! ' };
            } else {
                return { serverError: 'Ошибка сервера: ' + error.message };
            }
        }
    }

}
