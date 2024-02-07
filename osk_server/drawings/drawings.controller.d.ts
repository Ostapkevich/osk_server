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
        info: any;
        serverError?: undefined;
    } | {
        serverError: any;
        info?: undefined;
    }>;
    findByNumber(number: string): Promise<{
        info: any;
        serverError?: undefined;
    } | {
        serverError: any;
        info?: undefined;
    }>;
    scan(): {
        scan: string[];
        serverError?: undefined;
    } | {
        serverError: any;
        scan?: undefined;
    };
}
