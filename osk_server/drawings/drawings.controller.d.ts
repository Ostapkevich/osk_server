import { AppService } from 'src/app.service';
import { ScanService } from 'src/drawings/scan.service';
export declare class DrawingsController {
    protected appService: AppService;
    private scanService;
    constructor(appService: AppService, scanService: ScanService);
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
        serverError?: undefined;
    } | {
        serverError: any;
        drawing?: undefined;
        blank?: undefined;
        materials?: undefined;
    }>;
    findByNumber(drawingNumber: string): Promise<{
        drawing: any;
        blank: any;
        materials: any;
        serverError?: undefined;
    } | {
        serverError: any;
        drawing?: undefined;
        blank?: undefined;
        materials?: undefined;
    }>;
    findBy(partOfSql: string): Promise<{
        drawing: any;
        blank: any;
        materials: any;
        serverError?: undefined;
    } | {
        serverError: any;
        drawing?: undefined;
        blank?: undefined;
        materials?: undefined;
    }>;
    scan(): {
        scan: string[];
        serverError?: undefined;
    } | {
        serverError: any;
        scan?: undefined;
    };
}
