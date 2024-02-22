import { AppService } from 'src/app.service';
import { ScanService } from 'src/drawings/scan.service';
import { DrawingService } from './drawing.service';
export declare class CreateDrawingsController {
    protected appService: AppService;
    private scanService;
    private dravingSerice;
    constructor(appService: AppService, scanService: ScanService, dravingSerice: DrawingService);
    saveDrawing(bodyData: any): Promise<{
        response: any;
        serverError?: undefined;
    } | {
        serverError: any;
        response?: undefined;
    }>;
    saveBlank(typeBlank: number, bodyData: any): Promise<{
        id: any;
        serverError?: undefined;
    } | {
        serverError: any;
        id?: undefined;
    }>;
    deleteBlank(typeBlank: number, id: number, idDrawing: number, newTypeBlank: number): Promise<{
        response: string;
        serverError?: undefined;
    } | {
        serverError: any;
        response?: undefined;
    }>;
    deleteMaterial(id: number): Promise<{
        response: string;
        serverError?: undefined;
    } | {
        serverError: any;
        response?: undefined;
    }>;
    addPositionSP(bodyData: any): Promise<{
        idParent: number;
        id: any;
        serverError?: undefined;
    } | {
        serverError: any;
        idParent?: undefined;
        id?: undefined;
    }>;
    saveAll(typeBlank: string, bodyData: any): Promise<{
        response: string;
        serverError?: undefined;
    } | {
        serverError: any;
        response?: undefined;
    }>;
    addMaterial(bodyData: any): Promise<{
        id: any;
        serverError?: undefined;
    } | {
        serverError: any;
        id?: undefined;
    }>;
    findByID(id: number): Promise<{
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
    findByNumber(drawingNumber: string): Promise<{
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
    scan(): {
        scan: string[];
        serverError?: undefined;
    } | {
        serverError: any;
        scan?: undefined;
    };
}
