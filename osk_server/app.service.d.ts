export declare class AppService {
    private connection;
    constructor();
    query(...queries: string[]): Promise<[import("mysql2/typings/mysql/lib/protocol/packets/OkPacket").OkPacket | import("mysql2/typings/mysql/lib/protocol/packets/ResultSetHeader").ResultSetHeader | import("mysql2/typings/mysql/lib/protocol/packets/RowDataPacket").RowDataPacket[] | import("mysql2/typings/mysql/lib/protocol/packets/ResultSetHeader").ResultSetHeader[] | import("mysql2/typings/mysql/lib/protocol/packets/RowDataPacket").RowDataPacket[][] | import("mysql2/typings/mysql/lib/protocol/packets/OkPacket").OkPacket[] | [import("mysql2/typings/mysql/lib/protocol/packets/RowDataPacket").RowDataPacket[], import("mysql2/typings/mysql/lib/protocol/packets/ResultSetHeader").ResultSetHeader], import("mysql2/typings/mysql/lib/protocol/packets/FieldPacket").FieldPacket[]][]>;
    execute(sql: string, params: any): Promise<[import("mysql2/typings/mysql/lib/protocol/packets/OkPacket").OkPacket | import("mysql2/typings/mysql/lib/protocol/packets/ResultSetHeader").ResultSetHeader | import("mysql2/typings/mysql/lib/protocol/packets/RowDataPacket").RowDataPacket[] | import("mysql2/typings/mysql/lib/protocol/packets/ResultSetHeader").ResultSetHeader[] | import("mysql2/typings/mysql/lib/protocol/packets/RowDataPacket").RowDataPacket[][] | import("mysql2/typings/mysql/lib/protocol/packets/OkPacket").OkPacket[] | [import("mysql2/typings/mysql/lib/protocol/packets/RowDataPacket").RowDataPacket[], import("mysql2/typings/mysql/lib/protocol/packets/ResultSetHeader").ResultSetHeader], import("mysql2/typings/mysql/lib/protocol/packets/FieldPacket").FieldPacket[]]>;
    executeMultiple(bodyData: any[], ...queries: string[]): Promise<[import("mysql2/typings/mysql/lib/protocol/packets/OkPacket").OkPacket | import("mysql2/typings/mysql/lib/protocol/packets/ResultSetHeader").ResultSetHeader | import("mysql2/typings/mysql/lib/protocol/packets/RowDataPacket").RowDataPacket[] | import("mysql2/typings/mysql/lib/protocol/packets/ResultSetHeader").ResultSetHeader[] | import("mysql2/typings/mysql/lib/protocol/packets/RowDataPacket").RowDataPacket[][] | import("mysql2/typings/mysql/lib/protocol/packets/OkPacket").OkPacket[] | [import("mysql2/typings/mysql/lib/protocol/packets/RowDataPacket").RowDataPacket[], import("mysql2/typings/mysql/lib/protocol/packets/ResultSetHeader").ResultSetHeader], import("mysql2/typings/mysql/lib/protocol/packets/FieldPacket").FieldPacket[]][]>;
}
