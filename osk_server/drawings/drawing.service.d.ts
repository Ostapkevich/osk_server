import { AppService } from 'src/app.service';
export declare class DrawingService {
    private appService;
    constructor(appService: AppService);
    findDrawingInfoFull(partOfSql: string): Promise<{
        notFound: string;
        drawing?: undefined;
        blank?: undefined;
        materials?: undefined;
        positionsSP?: undefined;
        serverError?: undefined;
    } | {
        drawing: any;
        blank: any;
        materials: any;
        positionsSP: any;
        notFound?: undefined;
        serverError?: undefined;
    } | {
        serverError: any;
        notFound?: undefined;
        drawing?: undefined;
        blank?: undefined;
        materials?: undefined;
        positionsSP?: undefined;
    }>;
    drawingInfo(partOfSql: string): Promise<any[]> | undefined;
    blankInfo(idDrawing: number, typeBlank: number): Promise<any>;
    materialInfo(idDrawing: number): Promise<any>;
    spInfo(idDrawing: number): Promise<any[]>;
    selectPositionSP(typePosition: number, id: number): Promise<any>;
    selectDrawingPositionSP(typeBlank: number, idDrawing: number, id: number): string;
}
