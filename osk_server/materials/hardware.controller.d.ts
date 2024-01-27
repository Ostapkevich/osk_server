import { AppService } from 'src/app.service';
export declare class HardwareController {
    private appService;
    constructor(appService: AppService);
    onLoad(): Promise<{
        hardware_type: import("mysql2/typings/mysql/lib/protocol/packets/OkPacket").OkPacket | import("mysql2/typings/mysql/lib/protocol/packets/ResultSetHeader").ResultSetHeader | import("mysql2/typings/mysql/lib/protocol/packets/RowDataPacket").RowDataPacket[] | import("mysql2/typings/mysql/lib/protocol/packets/ResultSetHeader").ResultSetHeader[] | import("mysql2/typings/mysql/lib/protocol/packets/RowDataPacket").RowDataPacket[][] | import("mysql2/typings/mysql/lib/protocol/packets/OkPacket").OkPacket[] | [import("mysql2/typings/mysql/lib/protocol/packets/RowDataPacket").RowDataPacket[], import("mysql2/typings/mysql/lib/protocol/packets/ResultSetHeader").ResultSetHeader];
        steels: import("mysql2/typings/mysql/lib/protocol/packets/OkPacket").OkPacket | import("mysql2/typings/mysql/lib/protocol/packets/ResultSetHeader").ResultSetHeader | import("mysql2/typings/mysql/lib/protocol/packets/RowDataPacket").RowDataPacket[] | import("mysql2/typings/mysql/lib/protocol/packets/ResultSetHeader").ResultSetHeader[] | import("mysql2/typings/mysql/lib/protocol/packets/RowDataPacket").RowDataPacket[][] | import("mysql2/typings/mysql/lib/protocol/packets/OkPacket").OkPacket[] | [import("mysql2/typings/mysql/lib/protocol/packets/RowDataPacket").RowDataPacket[], import("mysql2/typings/mysql/lib/protocol/packets/ResultSetHeader").ResultSetHeader];
        hardwares: import("mysql2/typings/mysql/lib/protocol/packets/OkPacket").OkPacket | import("mysql2/typings/mysql/lib/protocol/packets/ResultSetHeader").ResultSetHeader | import("mysql2/typings/mysql/lib/protocol/packets/RowDataPacket").RowDataPacket[] | import("mysql2/typings/mysql/lib/protocol/packets/ResultSetHeader").ResultSetHeader[] | import("mysql2/typings/mysql/lib/protocol/packets/RowDataPacket").RowDataPacket[][] | import("mysql2/typings/mysql/lib/protocol/packets/OkPacket").OkPacket[] | [import("mysql2/typings/mysql/lib/protocol/packets/RowDataPacket").RowDataPacket[], import("mysql2/typings/mysql/lib/protocol/packets/ResultSetHeader").ResultSetHeader];
        serverError?: undefined;
    } | {
        serverError: any;
        hardware_type?: undefined;
        steels?: undefined;
        hardwares?: undefined;
    }>;
    deleteUnit(id: string): Promise<{
        response: string;
        serverError?: undefined;
    } | {
        serverError: string;
        response?: undefined;
    }>;
    loadRolled(rolledtype: number, steel: number, position: number, bodyData: any): Promise<{
        hardwares: import("mysql2/typings/mysql/lib/protocol/packets/OkPacket").OkPacket | import("mysql2/typings/mysql/lib/protocol/packets/ResultSetHeader").ResultSetHeader | import("mysql2/typings/mysql/lib/protocol/packets/RowDataPacket").RowDataPacket[] | import("mysql2/typings/mysql/lib/protocol/packets/ResultSetHeader").ResultSetHeader[] | import("mysql2/typings/mysql/lib/protocol/packets/RowDataPacket").RowDataPacket[][] | import("mysql2/typings/mysql/lib/protocol/packets/OkPacket").OkPacket[] | [import("mysql2/typings/mysql/lib/protocol/packets/RowDataPacket").RowDataPacket[], import("mysql2/typings/mysql/lib/protocol/packets/ResultSetHeader").ResultSetHeader];
        serverError?: undefined;
    } | {
        serverError: any;
        hardwares?: undefined;
    }>;
    createRolled(bodyData: any): Promise<{
        response: string;
        serverError?: undefined;
    } | {
        serverError: string;
        response?: undefined;
    }>;
    updateRolled(bodyData: any): Promise<{
        response: string;
        serverError?: undefined;
    } | {
        serverError: string;
        response?: undefined;
    }>;
}
