import { AppService } from 'src/app.service';
export declare class ViewDrawingsController {
    private appService;
    constructor(appService: AppService);
    viewDrawings(searchParams: any): Promise<{
        drawings: import("mysql2/typings/mysql/lib/protocol/packets/OkPacket").OkPacket | import("mysql2/typings/mysql/lib/protocol/packets/ResultSetHeader").ResultSetHeader | import("mysql2/typings/mysql/lib/protocol/packets/RowDataPacket").RowDataPacket[] | import("mysql2/typings/mysql/lib/protocol/packets/ResultSetHeader").ResultSetHeader[] | import("mysql2/typings/mysql/lib/protocol/packets/RowDataPacket").RowDataPacket[][] | import("mysql2/typings/mysql/lib/protocol/packets/OkPacket").OkPacket[] | [import("mysql2/typings/mysql/lib/protocol/packets/RowDataPacket").RowDataPacket[], import("mysql2/typings/mysql/lib/protocol/packets/ResultSetHeader").ResultSetHeader];
        serverError?: undefined;
    } | {
        serverError: any;
        drawings?: undefined;
    }>;
}
