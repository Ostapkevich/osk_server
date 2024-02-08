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
        response: any;
        serverError?: undefined;
    } | {
        serverError: any;
        response?: undefined;
    }>;
    saveUnits(typeBlank: string, bodyData: any): Promise<{
        response: string;
        serverError?: undefined;
    } | {
        serverError: any;
        response?: undefined;
    }>;
    findByID(id: number): Promise<{
        drawing: any;
        blank: any;
        serverError?: undefined;
    } | {
        serverError: any;
        drawing?: undefined;
        blank?: undefined;
    }>;
    findByNumber(drawingNumber: string): Promise<{
        drawing: any;
        blank: any;
        serverError?: undefined;
    } | {
        serverError: any;
        drawing?: undefined;
        blank?: undefined;
    }>;
    findBy(partOfSql: string): Promise<{
        drawing: any;
        blank: any;
        serverError?: undefined;
    } | {
        serverError: any;
        drawing?: undefined;
        blank?: undefined;
    }>;
    scan(): {
        scan: string[];
        serverError?: undefined;
    } | {
        serverError: any;
        scan?: undefined;
    };
}
