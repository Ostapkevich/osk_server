import { AppService } from 'src/app.service';
import { ScanService } from 'src/drawings/scan.service';
export declare class DrawingsController {
    protected appService: AppService;
    private scanService;
    constructor(appService: AppService, scanService: ScanService);
    saveUnits(typeBlank: string, bodyData: any): Promise<{
        response: string;
        serverError?: undefined;
    } | {
        serverError: any;
        response?: undefined;
    }>;
    scan(): {
        scan: string[];
        serverError?: undefined;
    } | {
        serverError: any;
        scan?: undefined;
    };
}
