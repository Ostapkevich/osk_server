import { AppService } from 'src/app.service';
export declare class DrawingService {
    private appService;
    constructor(appService: AppService);
    findBy(partOfSql: string): Promise<{
        drawing: any;
        blank: any;
        materials: any;
        positionsSP: any[];
        serverError?: undefined;
    } | {
        serverError: any;
        drawing?: undefined;
        blank?: undefined;
        materials?: undefined;
        positionsSP?: undefined;
    }>;
    selectPositionSP(typePosition: number, id: number): Promise<any>;
    selectDrawingPositionSP(typeBlank: number, idDrawing: number, id: number): string;
}
