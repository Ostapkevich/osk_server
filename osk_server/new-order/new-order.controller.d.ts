import { Iorder } from './iNewOrder';
import { AppService } from 'src/app.service';
export declare class NewOrderController {
    private appService;
    constructor(appService: AppService);
    getCustCat(): Promise<{
        customers: import("mysql2/typings/mysql/lib/protocol/packets/OkPacket").OkPacket | import("mysql2/typings/mysql/lib/protocol/packets/ResultSetHeader").ResultSetHeader | import("mysql2/typings/mysql/lib/protocol/packets/RowDataPacket").RowDataPacket[] | import("mysql2/typings/mysql/lib/protocol/packets/ResultSetHeader").ResultSetHeader[] | import("mysql2/typings/mysql/lib/protocol/packets/RowDataPacket").RowDataPacket[][] | import("mysql2/typings/mysql/lib/protocol/packets/OkPacket").OkPacket[] | [import("mysql2/typings/mysql/lib/protocol/packets/RowDataPacket").RowDataPacket[], import("mysql2/typings/mysql/lib/protocol/packets/ResultSetHeader").ResultSetHeader];
        categories: import("mysql2/typings/mysql/lib/protocol/packets/OkPacket").OkPacket | import("mysql2/typings/mysql/lib/protocol/packets/ResultSetHeader").ResultSetHeader | import("mysql2/typings/mysql/lib/protocol/packets/RowDataPacket").RowDataPacket[] | import("mysql2/typings/mysql/lib/protocol/packets/ResultSetHeader").ResultSetHeader[] | import("mysql2/typings/mysql/lib/protocol/packets/RowDataPacket").RowDataPacket[][] | import("mysql2/typings/mysql/lib/protocol/packets/OkPacket").OkPacket[] | [import("mysql2/typings/mysql/lib/protocol/packets/RowDataPacket").RowDataPacket[], import("mysql2/typings/mysql/lib/protocol/packets/ResultSetHeader").ResultSetHeader];
        serverError?: undefined;
    } | {
        serverError: string;
        customers?: undefined;
        categories?: undefined;
    }>;
    getOrder(id: string, isAnalog: string): Promise<{
        order: any;
        properties: import("mysql2/typings/mysql/lib/protocol/packets/OkPacket").OkPacket | import("mysql2/typings/mysql/lib/protocol/packets/ResultSetHeader").ResultSetHeader | import("mysql2/typings/mysql/lib/protocol/packets/RowDataPacket").RowDataPacket[] | import("mysql2/typings/mysql/lib/protocol/packets/ResultSetHeader").ResultSetHeader[] | import("mysql2/typings/mysql/lib/protocol/packets/RowDataPacket").RowDataPacket[][] | import("mysql2/typings/mysql/lib/protocol/packets/OkPacket").OkPacket[] | [import("mysql2/typings/mysql/lib/protocol/packets/RowDataPacket").RowDataPacket[], import("mysql2/typings/mysql/lib/protocol/packets/ResultSetHeader").ResultSetHeader];
        serverError?: undefined;
    } | {
        serverError: string;
        order?: undefined;
        properties?: undefined;
    }>;
    createOrder(bodyData: Iorder): Promise<{
        response: string;
        serverError?: undefined;
    } | {
        serverError: string;
        response?: undefined;
    }>;
    updateOrder(bodyData: Iorder): Promise<{
        response: string;
        serverError?: undefined;
    } | {
        serverError: string;
        response?: undefined;
    }>;
}
